import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospital } from 'react-icons/fa';

function ErrorPage() {
  return (
    <div className='error-page'>
      <FaHospital style={{ fontSize: '4rem', color: '#90a4ae', marginBottom: '1rem' }} />
      <h1>404</h1>
      <p>Oops! This page doesn't exist in our system.</p>
      <Link to='/'>
        <button className='btn btn-mediu-primary'>Return Home</button>
      </Link>
    </div>
  );
}

export default ErrorPage;
