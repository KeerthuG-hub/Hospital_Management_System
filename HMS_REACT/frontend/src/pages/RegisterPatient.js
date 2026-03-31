import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Navbar from '../components/Navbar';
import { createPatient, registerUser } from '../api';
import { setFlashMessage } from '../utils/flash';

const initialState = {
  displayName: '',
  username: '',
  password: '',
  confirmPassword: '',
  age: '',
  gender: 'Male',
  bloodGroup: 'A+',
  phone: '',
  address: ''
};

function RegisterPatient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');

  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const nextErrors = {};

    if (formData.displayName.trim().length < 3) nextErrors.displayName = 'Name must be at least 3 characters.';
    if (formData.username.trim().length < 4) nextErrors.username = 'Username must be at least 4 characters.';
    if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';
    if (!/^\d{10}$/.test(formData.phone)) nextErrors.phone = 'Enter a valid 10 digit phone number.';
    if (!formData.age || Number(formData.age) < 1 || Number(formData.age) > 120) nextErrors.age = 'Age must be between 1 and 120.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage('');

    if (!validate()) return;

    try {
      await registerUser({
        username: formData.username,
        password: formData.password,
        role: 'patient',
        displayName: formData.displayName,
        active: true
      });

      await createPatient({
        patientName: formData.displayName,
        age: Number(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        address: formData.address,
        diagnosis: 'Pending consultation',
        doctorAssigned: 'Not Assigned',
        admissionDate: new Date().toISOString()
      });

      setFlashMessage('Registration completed successfully. You can sign in now.', 'success');
      navigate('/login');
    } catch (err) {
      setServerMessage(err.message);
    }
  };

  return (
    <div className='form-page'>
      <Navbar />
      <div className='form-container'>
        <div className='page-header-inline'>
          <h2>Patient Registration</h2>
          <Link to='/login'>
            <button className='btn btn-mediu-primary'>Login</button>
          </Link>
        </div>
        <p className='section-subtitle'>Simple registration with basic validation.</p>
        {serverMessage && <Alert variant='danger'>{serverMessage}</Alert>}
        <Form onSubmit={handleSubmit} noValidate>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type='text'
                  value={formData.displayName}
                  onChange={(e) => setField('displayName', e.target.value)}
                  isInvalid={Boolean(errors.displayName)}
                />
                <Form.Control.Feedback type='invalid'>{errors.displayName}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type='text'
                  value={formData.username}
                  onChange={(e) => setField('username', e.target.value)}
                  isInvalid={Boolean(errors.username)}
                />
                <Form.Control.Feedback type='invalid'>{errors.username}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  value={formData.password}
                  onChange={(e) => setField('password', e.target.value)}
                  isInvalid={Boolean(errors.password)}
                />
                <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  value={formData.confirmPassword}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                  isInvalid={Boolean(errors.confirmPassword)}
                />
                <Form.Control.Feedback type='invalid'>{errors.confirmPassword}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className='mb-3'>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type='number'
                  value={formData.age}
                  onChange={(e) => setField('age', e.target.value)}
                  isInvalid={Boolean(errors.age)}
                />
                <Form.Control.Feedback type='invalid'>{errors.age}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className='mb-3'>
                <Form.Label>Gender</Form.Label>
                <Form.Select value={formData.gender} onChange={(e) => setField('gender', e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className='mb-3'>
                <Form.Label>Blood Group</Form.Label>
                <Form.Select value={formData.bloodGroup} onChange={(e) => setField('bloodGroup', e.target.value)}>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => (
                    <option key={group}>{group}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className='mb-3'>
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type='tel'
              value={formData.phone}
              onChange={(e) => setField('phone', e.target.value)}
              isInvalid={Boolean(errors.phone)}
            />
            <Form.Control.Feedback type='invalid'>{errors.phone}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className='mb-4'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type='text'
              value={formData.address}
              onChange={(e) => setField('address', e.target.value)}
            />
          </Form.Group>
          <button type='submit' className='btn btn-mediu-accent w-100'>Create Patient Account</button>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPatient;
