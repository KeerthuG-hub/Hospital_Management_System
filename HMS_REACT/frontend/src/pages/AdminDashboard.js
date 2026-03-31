import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { FaCalendarAlt, FaHospitalUser, FaUserMd, FaUsers } from 'react-icons/fa';
import {
  createDoctor,
  deletePatient,
  getAppointments,
  getDoctors,
  getPatients,
  getUsers,
  registerUser,
  updateUser
} from '../api';
import DeleteModal from '../components/DeleteModal';
import Navbar from '../components/Navbar';
import { consumeFlashMessage } from '../utils/flash';
import { getCurrentUser } from '../utils/session';

const initialDoctorForm = {
  doctorName: '',
  specialization: '',
  phone: '',
  email: '',
  shift: 'Morning',
  username: '',
  password: ''
};

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [doctorForm, setDoctorForm] = useState(initialDoctorForm);
  const [doctors, setDoctors] = useState([]);
  const [doctorUsers, setDoctorUsers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [alert, setAlert] = useState({ variant: 'info', message: '' });
  const [deleteState, setDeleteState] = useState({ show: false, patient: null });

  const fetchData = async () => {
    try {
      const [doctorList, doctorUserList, patientList, appointmentList] = await Promise.all([
        getDoctors(),
        getUsers('doctor'),
        getPatients(),
        getAppointments()
      ]);
      setDoctors(doctorList);
      setDoctorUsers(doctorUserList);
      setPatients(patientList);
      setAppointments(appointmentList);
    } catch (err) {
      setAlert({ variant: 'danger', message: err.message });
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    const flash = consumeFlashMessage();
    if (flash?.message) {
      setAlert({ variant: flash.variant || 'success', message: flash.message });
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return undefined;
    const intervalId = setInterval(fetchData, 15000);
    return () => clearInterval(intervalId);
  }, [user?.role]);

  const doctorAccounts = useMemo(() => {
    return doctors.map((doctor) => ({
      ...doctor,
      userAccount: doctorUsers.find((account) => account.displayName === doctor.doctorName)
    }));
  }, [doctorUsers, doctors]);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    try {
      await createDoctor({
        doctorName: doctorForm.doctorName,
        specialization: doctorForm.specialization,
        phone: doctorForm.phone,
        email: doctorForm.email,
        shift: doctorForm.shift
      });
      await registerUser({
        username: doctorForm.username,
        password: doctorForm.password,
        role: 'doctor',
        displayName: doctorForm.doctorName,
        active: true
      });
      setDoctorForm(initialDoctorForm);
      setAlert({ variant: 'success', message: 'Doctor account created successfully.' });
      fetchData();
    } catch (err) {
      setAlert({ variant: 'danger', message: err.message });
    }
  };

  const toggleDoctorStatus = async (account) => {
    try {
      await updateUser(account._id, { ...account, active: !account.active });
      setAlert({
        variant: 'success',
        message: `Doctor account ${account.active ? 'deactivated' : 'reactivated'} successfully.`
      });
      fetchData();
    } catch (err) {
      setAlert({ variant: 'danger', message: err.message });
    }
  };

  const handleDeletePatient = async () => {
    if (!deleteState.patient) return;

    try {
      await deletePatient(deleteState.patient._id);
      setDeleteState({ show: false, patient: null });
      setAlert({ variant: 'success', message: 'Patient deleted successfully.' });
      fetchData();
    } catch (err) {
      setAlert({ variant: 'danger', message: err.message });
    }
  };

  return (
    <div className='dashboard-page'>
      <Navbar />
      <div className='dashboard-content'>
        <div className='dashboard-header'>
          <div>
            <h2>Admin Dashboard</h2>
            <p className='section-subtitle'>Manage doctor accounts, patients, and appointments.</p>
          </div>
          <Link to='/save-patient'>
            <button className='btn btn-mediu-primary'>Add Patient</button>
          </Link>
        </div>

        {alert.message && <Alert variant={alert.variant}>{alert.message}</Alert>}

        <div className='stat-cards'>
          <div className='stat-card'>
            <span className='stat-icon'><FaUserMd /></span>
            <div>
              <div className='stat-label'>Doctors</div>
              <div className='stat-value'>{doctorAccounts.length}</div>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon'><FaUsers /></span>
            <div>
              <div className='stat-label'>Patients</div>
              <div className='stat-value'>{patients.length}</div>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon'><FaCalendarAlt /></span>
            <div>
              <div className='stat-label'>Appointments</div>
              <div className='stat-value'>{appointments.length}</div>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon'><FaHospitalUser /></span>
            <div>
              <div className='stat-label'>Active Doctors</div>
              <div className='stat-value'>{doctorAccounts.filter((doctor) => doctor.userAccount?.active).length}</div>
            </div>
          </div>
        </div>

        <div className='content-grid admin-grid'>
          <div className='form-container compact-card'>
            <h2>Create Doctor Account</h2>
            <Form onSubmit={handleCreateDoctor}>
              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Doctor Name</Form.Label>
                    <Form.Control
                      type='text'
                      value={doctorForm.doctorName}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, doctorName: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Specialization</Form.Label>
                    <Form.Control
                      type='text'
                      value={doctorForm.specialization}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, specialization: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type='tel'
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type='email'
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Shift</Form.Label>
                    <Form.Select
                      value={doctorForm.shift}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, shift: e.target.value }))}
                    >
                      <option>Morning</option>
                      <option>Evening</option>
                      <option>Night</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type='text'
                      value={doctorForm.username}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type='password'
                      value={doctorForm.password}
                      onChange={(e) => setDoctorForm((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <button className='btn btn-mediu-accent w-100' type='submit'>Create Doctor</button>
            </Form>
          </div>

          <div className='table-card'>
            <div className='table-card-header'>
              <h5>Doctor Accounts</h5>
            </div>
            <Table responsive hover className='mb-0'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Shift</th>
                  <th>Login Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctorAccounts.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>{doctor.doctorName}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.shift}</td>
                    <td>{doctor.userAccount?.active ? 'Active' : 'Inactive'}</td>
                    <td>
                      {doctor.userAccount ? (
                        <button
                          className='btn btn-outline-secondary btn-sm'
                          onClick={() => toggleDoctorStatus(doctor.userAccount)}
                        >
                          {doctor.userAccount.active ? 'Deactivate' : 'Activate'}
                        </button>
                      ) : 'No login account'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <div className='table-card mt-4'>
          <div className='table-card-header'>
            <h5>All Appointments</h5>
          </div>
          <Table responsive hover className='mb-0'>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length ? appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.doctorName}</td>
                  <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                  <td>{appointment.reason}</td>
                  <td>{appointment.status}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan='5' className='empty-state-cell'>No appointments found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div className='table-card mt-4'>
          <div className='table-card-header'>
            <h5>Manage Patients</h5>
          </div>
          <Table responsive hover className='mb-0'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Diagnosis</th>
                <th>Doctor</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {patients.length ? patients.map((patient) => (
                <tr key={patient._id}>
                  <td>{patient.patientName}</td>
                  <td>{patient.age}</td>
                  <td>{patient.diagnosis}</td>
                  <td>{patient.doctorAssigned}</td>
                  <td>
                    <Link to={`/save-patient/${patient._id}`}>
                      <button className='btn btn-outline-primary btn-sm'>Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className='btn btn-outline-danger btn-sm'
                      onClick={() => setDeleteState({ show: true, patient })}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan='6' className='empty-state-cell'>No patients found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <DeleteModal
          showDeleteModal={deleteState.show}
          setShowDeleteModal={(show) => setDeleteState((prev) => ({ ...prev, show }))}
          itemName={deleteState.patient?.patientName}
          itemType='patient record'
          onConfirm={handleDeletePatient}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
