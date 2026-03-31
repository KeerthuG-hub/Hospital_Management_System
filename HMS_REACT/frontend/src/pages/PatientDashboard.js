import React, { useEffect, useMemo, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaCalendarAlt, FaHeartbeat, FaUserMd } from 'react-icons/fa';
import { createAppointment, getAppointments, getDoctors, getPatients, updateAppointment } from '../api';
import Navbar from '../components/Navbar';
import { consumeFlashMessage } from '../utils/flash';
import { getCurrentUser } from '../utils/session';
import { useNavigate } from 'react-router-dom';

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

function PatientDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [patientRecord, setPatientRecord] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [scheduleAppointments, setScheduleAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [notice, setNotice] = useState({ variant: 'danger', message: '' });
  const [booking, setBooking] = useState({
    doctorName: '',
    appointmentSlot: '',
    reason: ''
  });

  const fetchData = async () => {
    try {
      const [patients, allAppointments, doctorList] = await Promise.all([
        getPatients(),
        getAppointments(),
        getDoctors()
      ]);
      setPatientRecord(
        patients.find(
          (patient) => patient.patientName.toLowerCase().trim() === user.displayName.toLowerCase().trim()
        ) || null
      );
      setScheduleAppointments(allAppointments);
      setAppointments(allAppointments.filter((appointment) => appointment.patientUserId === user.userId));
      setDoctors(doctorList);
      if (!booking.doctorName && doctorList[0]?.doctorName) {
        setBooking((prev) => ({ ...prev, doctorName: doctorList[0].doctorName }));
      }
    } catch (err) {
      setNotice({ variant: 'danger', message: err.message });
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'patient') {
      navigate('/login');
      return;
    }
    const flash = consumeFlashMessage();
    if (flash?.message) {
      setNotice({ variant: flash.variant || 'success', message: flash.message });
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!user || user.role !== 'patient') return undefined;
    const intervalId = setInterval(fetchData, 15000);
    return () => clearInterval(intervalId);
  }, [user?.role]);

  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter((appointment) => appointment.status === 'Pending').length,
    prescriptions: appointments.filter((appointment) => appointment.prescription).length
  }), [appointments]);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => doctor.doctorName === booking.doctorName) || null,
    [doctors, booking.doctorName]
  );

  const availableSlots = useMemo(() => {
    if (!selectedDoctor) {
      return [];
    }

    const bookedSlots = new Set(
      scheduleAppointments
        .filter((appointment) => appointment.doctorName === booking.doctorName)
        .filter((appointment) => appointment.status !== 'Cancelled')
        .map((appointment) => parseValidSlot(appointment.appointmentDate))
        .filter(Boolean)
        .map((appointment) => appointment.toISOString())
    );

    return (selectedDoctor.availabilitySlots || [])
      .map((slot) => parseValidSlot(slot))
      .filter(Boolean)
      .map((slot) => slot.toISOString())
      .filter((slot) => new Date(slot) >= new Date())
      .filter((slot) => !bookedSlots.has(slot))
      .filter((slot, index, array) => array.indexOf(slot) === index)
      .sort();
  }, [scheduleAppointments, booking.doctorName, selectedDoctor]);

  const handleBook = async (e) => {
    e.preventDefault();
    setNotice({ variant: 'danger', message: '' });

    if (!booking.appointmentSlot) {
      setNotice({ variant: 'danger', message: 'Please choose an available appointment slot.' });
      return;
    }

    try {
      await createAppointment({
        patientUserId: user.userId,
        patientName: user.displayName,
        doctorName: booking.doctorName,
        appointmentDate: booking.appointmentSlot,
        reason: booking.reason,
        status: 'Pending',
        notes: '',
        prescription: ''
      });
      setBooking({
        doctorName: booking.doctorName,
        appointmentSlot: '',
        reason: ''
      });
      setNotice({ variant: 'success', message: 'Appointment requested successfully.' });
      fetchData();
    } catch (err) {
      setNotice({ variant: 'danger', message: err.message });
    }
  };

  const cancelAppointment = async (appointment) => {
    try {
      await updateAppointment(appointment._id, { ...appointment, status: 'Cancelled' });
      setNotice({ variant: 'success', message: 'Appointment cancelled successfully.' });
      fetchData();
    } catch (err) {
      setNotice({ variant: 'danger', message: err.message });
    }
  };

  return (
    <div className='dashboard-page'>
      <Navbar />
      <div className='dashboard-content'>
        <div className='welcome-card'>
          <h3>Welcome, {user?.displayName || 'Patient'}</h3>
          <p>Book appointments, check prescriptions, and review your history.</p>
        </div>

        {notice.message && <Alert variant={notice.variant}>{notice.message}</Alert>}

        <div className='stat-cards'>
          <div className='stat-card'>
            <span className='stat-icon'><FaCalendarAlt /></span>
            <div>
              <div className='stat-label'>Appointments</div>
              <div className='stat-value'>{stats.total}</div>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon'><FaHeartbeat /></span>
            <div>
              <div className='stat-label'>Pending</div>
              <div className='stat-value'>{stats.pending}</div>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon'><FaUserMd /></span>
            <div>
              <div className='stat-label'>Prescriptions</div>
              <div className='stat-value'>{stats.prescriptions}</div>
            </div>
          </div>
        </div>

        <div className='content-grid'>
          <div className='form-container compact-card'>
            <h2>Schedule Consultation</h2>
            <Form onSubmit={handleBook}>
              <Form.Group className='mb-3'>
                <Form.Label>Consultant</Form.Label>
                <Form.Select
                  value={booking.doctorName}
                  onChange={(e) => setBooking((prev) => ({
                    ...prev,
                    doctorName: e.target.value,
                    appointmentSlot: ''
                  }))}
                  required
                >
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor.doctorName}>
                      {doctor.doctorName} - {doctor.specialization}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Available Slot</Form.Label>
                <Form.Select
                  value={booking.appointmentSlot}
                  onChange={(e) => setBooking((prev) => ({ ...prev, appointmentSlot: e.target.value }))}
                  disabled={!availableSlots.length}
                  required
                >
                  <option value=''>
                    {availableSlots.length ? 'Select an appointment slot' : 'No slots available'}
                  </option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatSlotDateTime(slot)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>Visit Reason</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  minLength={5}
                  value={booking.reason}
                  onChange={(e) => setBooking((prev) => ({ ...prev, reason: e.target.value }))}
                  required
                />
              </Form.Group>
              <button type='submit' className='btn btn-mediu-accent w-100'>Confirm Booking</button>
            </Form>
          </div>

          <div className='table-card profile-card'>
            <div className='table-card-header'>
              <h5>Patient Information</h5>
            </div>
            <div className='profile-list'>
              <div><strong>Name:</strong> {patientRecord?.patientName || user.displayName}</div>
              <div><strong>Age:</strong> {patientRecord?.age || '-'}</div>
              <div><strong>Gender:</strong> {patientRecord?.gender || '-'}</div>
              <div><strong>Blood Group:</strong> {patientRecord?.bloodGroup || '-'}</div>
              <div><strong>Primary Consultant:</strong> {patientRecord?.doctorAssigned || 'Not Assigned'}</div>
              <div><strong>Diagnosis:</strong> {patientRecord?.diagnosis || 'Pending consultation'}</div>
            </div>
          </div>
        </div>

        <div className='table-card mt-4'>
          <div className='table-card-header'>
            <h5>Consultation History</h5>
          </div>
          <Table responsive hover className='mb-0'>
            <thead>
              <tr>
                <th>Consultant</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Prescription</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length ? appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.doctorName}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                  <td>{appointment.reason}</td>
                  <td>{appointment.status}</td>
                  <td>{appointment.prescription || '-'}</td>
                  <td>
                    {appointment.status === 'Pending' ? (
                      <button className='btn btn-outline-danger btn-sm' onClick={() => cancelAppointment(appointment)}>
                        Cancel
                      </button>
                    ) : '—'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan='6' className='empty-state-cell'>No appointments booked yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
