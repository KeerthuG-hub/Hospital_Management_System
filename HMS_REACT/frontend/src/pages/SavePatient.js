import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { createPatient, getDoctors, getPatient, updatePatient } from '../api';
import Navbar from '../components/Navbar';
import { setFlashMessage } from '../utils/flash';
import { getCurrentUser, getDashboardPath } from '../utils/session';

const initialPatient = {
  patientName: '',
  age: '',
  gender: 'Male',
  bloodGroup: 'A+',
  phone: '',
  address: '',
  diagnosis: 'Pending consultation',
  doctorAssigned: 'Not Assigned',
  admissionDate: ''
};

function SavePatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [patientInfo, setPatientInfo] = useState(initialPatient);
  const [doctors, setDoctors] = useState([]);
  const [alert, setAlert] = useState({ show: false, variant: 'success', message: '' });
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const doctorList = await getDoctors();
        setDoctors(doctorList);

        if (id) {
          const payload = await getPatient(id);
          const patient = payload[0];
          if (patient) {
            setPatientInfo({
              ...patient,
              admissionDate: patient.admissionDate ? patient.admissionDate.substring(0, 10) : ''
            });
          }
        } else if (doctorList[0]?.doctorName) {
          setPatientInfo((prev) => ({ ...prev, doctorAssigned: doctorList[0].doctorName }));
        }
      } catch (err) {
        setAlert({ show: true, variant: 'danger', message: err.message });
      }
    };

    loadData();
  }, [id, navigate]);

  const backPath = useMemo(() => getDashboardPath(user?.role || 'doctor'), [user]);

  const setField = (field, value) => {
    setPatientInfo((prev) => ({ ...prev, [field]: field === 'age' ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updatePatient(id, patientInfo);
      } else {
        await createPatient(patientInfo);
      }
      setFlashMessage(isEdit ? 'Patient profile updated successfully.' : 'Patient record created successfully.');
      setTimeout(() => navigate(backPath), 900);
    } catch (err) {
      setAlert({ show: true, variant: 'danger', message: err.message });
    }
  };

  return (
    <div className='form-page'>
      <Navbar />
      <div className='form-container'>
        <div className='page-header-inline'>
          <h2>{isEdit ? 'Edit Patient' : 'Add Patient'}</h2>
          <Link to={backPath}>
            <button className='btn btn-mediu-primary'>Back</button>
          </Link>
        </div>
        {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Patient Name</Form.Label>
                <Form.Control
                  type='text'
                  value={patientInfo.patientName}
                  onChange={(e) => setField('patientName', e.target.value)}
                  minLength={2}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type='number'
                  min={1}
                  max={120}
                  value={patientInfo.age}
                  onChange={(e) => setField('age', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Gender</Form.Label>
                <Form.Select value={patientInfo.gender} onChange={(e) => setField('gender', e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Blood Group</Form.Label>
                <Form.Select value={patientInfo.bloodGroup} onChange={(e) => setField('bloodGroup', e.target.value)}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                    <option key={group}>{group}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type='tel'
                  pattern='[0-9]{10}'
                  value={patientInfo.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Admission Date</Form.Label>
                <Form.Control
                  type='date'
                  value={patientInfo.admissionDate}
                  onChange={(e) => setField('admissionDate', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className='mb-3'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type='text'
              value={patientInfo.address}
              onChange={(e) => setField('address', e.target.value)}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Diagnosis</Form.Label>
            <Form.Control
              type='text'
              value={patientInfo.diagnosis}
              onChange={(e) => setField('diagnosis', e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Doctor Assigned</Form.Label>
            <Form.Select
              value={patientInfo.doctorAssigned}
              onChange={(e) => setField('doctorAssigned', e.target.value)}
            >
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor.doctorName}>
                  {doctor.doctorName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <button type='submit' className='btn btn-mediu-accent w-100'>
            {isEdit ? 'Update Patient' : 'Save Patient'}
          </button>
        </Form>
      </div>
    </div>
  );
}

export default SavePatient;
