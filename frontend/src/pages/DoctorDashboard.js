import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaCalendarAlt, FaHeartbeat, FaUserInjured } from 'react-icons/fa';
import { getAppointments, getDoctors, getPatients, updateAppointment, updateDoctor } from '../api';
import Navbar from '../components/Navbar';
import { consumeFlashMessage } from '../utils/flash';
import { getCurrentUser } from '../utils/session';

function parseValidSlot(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatSlotDateTime(value) {
  const parsed = parseValidSlot(value);
  if (!parsed) return '';
  return parsed.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function getMinSlotDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function DoctorDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [slotInput, setSlotInput] = useState('');
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const [allPatients, allAppointments, allDoctors] = await Promise.all([getPatients(), getAppointments(), getDoctors()]);
      const myAppointments = allAppointments.filter(
        (appointment) => appointment.doctorName?.toLowerCase().trim() === user.displayName?.toLowerCase().trim()
      );
      const patientNames = new Set(myAppointments.map((appointment) => appointment.patientName));

      setAppointments(myAppointments);
      setPatients(
        allPatients.filter((patient) => patientNames.has(patient.patientName))
      );
      setDoctorProfile(
        allDoctors.find(
          (doctor) => doctor.doctorName?.toLowerCase().trim() === user.displayName?.toLowerCase().trim()
        )
      );
    } catch (err) {
      setPatients([]);
      setAppointments([]);
      setDoctorProfile(null);
      setMessage(err.message);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate('/login');
      return;
    }
    const flash = consumeFlashMessage();
    if (flash?.message) {
      setMessage(flash.message);
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!user || user.role !== 'doctor') return undefined;
    const intervalId = setInterval(fetchData, 15000);
    return () => clearInterval(intervalId);
  }, [user?.role]);

  const patientHistory = useMemo(() => {
    return patients.map((patient) => ({
      ...patient,
      appointments: appointments.filter((appointment) => appointment.patientName === patient.patientName)
    }));
  }, [appointments, patients]);

  const activeAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status !== 'Completed' && appointment.status !== 'Cancelled'),
    [appointments]
  );

  const bookedSlotSet = useMemo(
    () =>
      new Set(
        appointments
          .filter((appointment) => appointment.status !== 'Cancelled')
          .map((appointment) => parseValidSlot(appointment.appointmentDate))
          .filter(Boolean)
          .map((appointment) => appointment.toISOString())
      ),
    [appointments]
  );

  const publishedAvailableSlots = useMemo(
    () =>
      (doctorProfile?.availabilitySlots || [])
        .filter((slot) => parseValidSlot(slot))
        .map((slot) => new Date(slot).toISOString())
        .filter((slot, index, array) => array.indexOf(slot) === index)
        .filter((slot) => !bookedSlotSet.has(slot))
        .sort(),
    [doctorProfile, bookedSlotSet]
  );

  const handleAppointmentChange = async (appointment, field, value) => {
    try {
      await updateAppointment(appointment._id, { ...appointment, [field]: value });
      setMessage(field === 'prescription' ? 'Prescription saved successfully.' : 'Appointment status updated successfully.');
      fetchData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const addAvailabilitySlot = async (e) => {
    e.preventDefault();
    const nextSlot = slotInput ? new Date(slotInput).toISOString() : '';

    if (!nextSlot || !doctorProfile) return;
    if (bookedSlotSet.has(nextSlot)) {
      setMessage('This appointment slot has already been booked.');
      return;
    }

    try {
      const availabilitySlots = Array.from(
        new Set(
          [...(doctorProfile.availabilitySlots || []), nextSlot]
            .filter((slot) => parseValidSlot(slot))
            .map((slot) => new Date(slot).toISOString())
        )
      )
        .filter((slot) => !bookedSlotSet.has(slot))
        .sort();
      await updateDoctor(doctorProfile._id, { ...doctorProfile, availabilitySlots });
      setSlotInput('');
      setMessage('Appointment slot published successfully.');
      fetchData();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className='dashboard-page'>
      <Navbar />
      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div>
            <h2>Doctor Dashboard</h2>
            <p className='section-subtitle'>Review your consultation schedule, patient records, and published appointment slots.</p>
          </div>
        </div>

        {message && <Alert variant='info'>{message}</Alert>}

        <div className='stat-cards'>
          <div className='stat-card'>
            <span className='stat-icon'><FaUserInjured /></span>
            <div>
              <div className='stat-label'>Assigned Patients</div>
              <div className='stat-value'>{patients.length}</div>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon'><FaCalendarAlt /></span>
            <div>
              <div className='stat-label'>My Appointments</div>
              <div className='stat-value'>{activeAppointments.length}</div>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon'><FaHeartbeat /></span>
            <div>
              <div className='stat-label'>Pending Cases</div>
              <div className='stat-value'>{activeAppointments.filter((item) => item.status === 'Pending').length}</div>
            </div>
          </div>
        </div>

        <div className='table-card'>
          <div className='table-card-header'>
            <h5>Current Appointments</h5>
          </div>
          <Table responsive hover className='mb-0'>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Prescription</th>
                <th>Save</th>
              </tr>
            </thead>
            <tbody>
              {activeAppointments.length ? activeAppointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.patientName}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                  <td>{appointment.reason}</td>
                  <td>
                    <Form.Select
                      value={appointment.status}
                      onChange={(e) => handleAppointmentChange(appointment, 'status', e.target.value)}
                    >
                      {appointment.status === 'Pending' && <option>Pending</option>}
                      <option>Confirmed</option>
                      <option>Completed</option>
                      {appointment.status === 'Cancelled' && <option>Cancelled</option>}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type='text'
                      value={appointment.prescription || ''}
                      placeholder='Add simple prescription'
                      onChange={(e) =>
                        setAppointments((prev) =>
                          prev.map((item) =>
                            item._id === appointment._id ? { ...item, prescription: e.target.value } : item
                          )
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className='btn btn-mediu-accent btn-sm'
                      onClick={() =>
                        handleAppointmentChange(
                          appointments.find((item) => item._id === appointment._id) || appointment,
                          'prescription',
                          (appointments.find((item) => item._id === appointment._id) || appointment).prescription || ''
                        )
                      }
                    >
                      Save
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan='6' className='empty-state-cell'>No current appointments are scheduled.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className='table-card mt-4'>
          <div className='table-card-header'>
            <h5>Patient Records</h5>
          </div>
          <Table responsive className='mb-0'>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Diagnosis</th>
                <th>Phone</th>
                <th>Address</th>
                <th>History</th>
              </tr>
            </thead>
            <tbody>
              {patientHistory.length ? patientHistory.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.patientName}</td>
                  <td>{patient.diagnosis}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.address || '-'}</td>
                  <td>{patient.appointments.map((item) => item.status).join(', ') || 'No appointments yet'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan='5' className='empty-state-cell'>No patient records are available for your current appointments.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className='content-grid mt-4'>
          <div className='form-container compact-card'>
            <h2>Appointment Slots</h2>
            <Form onSubmit={addAvailabilitySlot}>
              <Form.Group className='mb-3'>
                <Form.Label>Add Date and Time</Form.Label>
                <Form.Control
                  type='datetime-local'
                  min={getMinSlotDateTime()}
                  value={slotInput}
                  onChange={(e) => setSlotInput(e.target.value)}
                />
              </Form.Group>
              <button type='submit' className='btn btn-mediu-accent w-100'>Publish Slot</button>
            </Form>
          </div>

          <div className='table-card'>
            <div className='table-card-header'>
              <h5>Published Slots</h5>
            </div>
            <div className='profile-list'>
              {publishedAvailableSlots.length ? (
                publishedAvailableSlots
                  .map((slot) => <div key={slot}>{formatSlotDateTime(slot)}</div>)
              ) : (
                <div>No appointment slots have been published yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
