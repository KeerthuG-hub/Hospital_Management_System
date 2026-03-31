import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHospital, FaSignOutAlt, FaUserMd } from 'react-icons/fa';
import { clearCurrentUser, getCurrentUser, getDashboardPath } from '../utils/session';

function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser() || {};

  const handleLogout = () => {
    clearCurrentUser();
    navigate('/');
  };

  const links = [{ label: 'Home', to: '/' }];

  if (user.role) {
    links.push({ label: 'Dashboard', to: getDashboardPath(user.role) });
  }

  if (user.role === 'patient') {
    links.push({ label: 'Book Appointment', to: '/patient-dashboard' });
  }

  if (!user.role) {
    links.push({ label: 'Login', to: '/login' });
    links.push({ label: 'Register', to: '/patient-register' });
  }

  return (
    <nav className='mediu-navbar'>
      <Link className='brand' to='/'>
        <FaHospital style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.5rem' }} />
        <div>
          <div className='brand-name'>MEDIU</div>
          <div className='brand-sub'>Hospital Management System</div>
        </div>
      </Link>
      <div className='nav-actions'>
        <div className='nav-links'>
          {links.map((link) => (
            <Link key={link.to + link.label} to={link.to} className='nav-link-item'>
              {link.label}
            </Link>
          ))}
        </div>
        {user.displayName && (
          <span className='nav-user'>
            <FaUserMd style={{ marginRight: '0.4rem' }} />
            {user.displayName}
          </span>
        )}
        {user.role && (
          <button className='logout-btn' onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '0.3rem' }} />
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
