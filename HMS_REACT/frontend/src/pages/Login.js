import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import { FaHospital } from 'react-icons/fa';
import { loginUser } from '../api';
import { consumeFlashMessage } from '../utils/flash';
import { getDashboardPath, setCurrentUser } from '../utils/session';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [notice, setNotice] = useState({ variant: 'danger', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const flash = consumeFlashMessage();
    if (flash?.message) {
      setNotice({ variant: flash.variant || 'success', message: flash.message });
    }
  }, []);

  const handleChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setNotice({ variant: 'danger', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = await loginUser(credentials);
      setCurrentUser(payload);
      navigate(getDashboardPath(payload.role));
    } catch (err) {
      setNotice({ variant: 'danger', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-card'>
        <div className='login-logo'>
          <div className='hospital-icon'><FaHospital /></div>
          <h1>MEDIU</h1>
          <p>Login to continue</p>
        </div>
        {notice.message && <Alert variant={notice.variant} className='py-2 px-3 mb-3'>{notice.message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className='mb-3' controlId='loginUsername'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter username'
              value={credentials.username}
              onChange={(e) => handleChange('username', e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3' controlId='loginPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={credentials.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
          </Form.Group>
          <button type='submit' className='btn-login btn' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </Form>
        <div className='helper-links'>
          <Link to='/patient-register'>New patient? Register here</Link>
          <Link to='/'>Back to homepage</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
