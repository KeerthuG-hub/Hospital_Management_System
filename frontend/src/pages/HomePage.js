import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaFacebook,
  FaHeartbeat,
  FaUserMd,
  FaFlask,
  FaAmbulance,
  FaShieldAlt,
  FaClock,
  FaStar,
  FaPhone,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaInstagram,
  FaLinkedin
} from 'react-icons/fa';
import Navbar from '../components/Navbar';

const services = [
  {
    icon: <FaHeartbeat />,
    bg: '#dbeafe',
    color: '#0b4f7a',
    title: 'Cardiology',
    desc: 'Advanced cardiac care including diagnostics, long-term monitoring, and specialist consultation.'
  },
  {
    icon: <FaUserMd />,
    bg: '#dff5ef',
    color: '#0f766e',
    title: 'General Medicine',
    desc: 'Comprehensive consultation and inpatient support for routine care and complex medical needs.'
  },
  {
    icon: <FaFlask />,
    bg: '#e0ecff',
    color: '#1d4ed8',
    title: 'Diagnostics & Lab',
    desc: 'Reliable laboratory and diagnostic services that support timely and accurate clinical decisions.'
  },
  {
    icon: <FaAmbulance />,
    bg: '#ffedd5',
    color: '#c2410c',
    title: 'Emergency Care',
    desc: 'Round-the-clock emergency support with rapid response for critical and urgent medical situations.'
  },
  {
    icon: <FaShieldAlt />,
    bg: '#ede9fe',
    color: '#6d28d9',
    title: 'Preventive Health',
    desc: 'Health screening and preventive care services designed to support safer long-term wellness.'
  },
  {
    icon: <FaStar />,
    bg: '#dcfce7',
    color: '#15803d',
    title: 'Specialist Consultations',
    desc: 'Access to experienced specialists across departments through an organised hospital system.'
  }
];

const whyPoints = [
  {
    icon: <FaUserMd />,
    title: 'Experienced Medical Team',
    desc: 'Our clinical teams bring deep experience across departments with a strong focus on quality care.'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Reliable Hospital Processes',
    desc: 'Structured records and organised workflows support accurate care delivery across the hospital.'
  },
  {
    icon: <FaClock />,
    title: 'Efficient Coordination',
    desc: 'Clear digital workflows reduce delays and help teams stay aligned across daily operations.'
  },
  {
    icon: <FaCheckCircle />,
    title: 'Trusted Care Environment',
    desc: 'MEDIU is designed around consistency, safety, and clarity for both staff and patients.'
  }
];

const testimonials = [
  {
    text: 'The doctors and staff at MEDIU were extremely caring and professional. From diagnosis to recovery, every step was handled with compassion and clarity.',
    author: 'Shyaam Singh'
  },
  {
    text: 'The hospital environment was clean, organised, and reassuring. We always felt informed and supported throughout the treatment process.',
    author: 'Nisha Menon'
  },
  {
    text: 'MEDIU gave our family confidence during a difficult time. The medical team explained everything clearly and treated us with genuine kindness.',
    author: 'Raghav Kumar'
  }
];

export default function HomePage() {
  return (
    <div className='home-page'>
      <Navbar />

      <section className='hero'>
        <div className='hero-left'>
          <span className='hero-eyebrow'>MEDIU Hospital</span>
          <h1>
            Your health is our
            <br />
            <span>highest priority.</span>
          </h1>
          <p>
            At MEDIU, we combine compassionate care, experienced clinicians, and dependable hospital
            services to support patients and families with confidence.
          </p>
          <div className='hero-actions'>
            <Link to='/patient-register' className='btn-primary'>Register Patient</Link>
            <Link to='/login' className='btn-ghost'>Login</Link>
          </div>
        </div>

        <div className='hero-right'>
          <div className='hero-visual'>
            <div className='hero-visual-header'>
              <div className='hv-dot' />
              <div className='hv-dot' />
              <div className='hv-dot' />
              <span className='hv-title'>Care Highlights</span>
            </div>
            {[
              { title: 'Specialist Care', desc: 'Experienced doctors across departments for consultations, treatment, and follow-up care.' },
              { title: 'Modern Facilities', desc: 'Well-equipped hospital infrastructure designed to support accurate diagnosis and safe care.' },
              { title: 'Patient-Centred Support', desc: 'A care environment focused on comfort, responsiveness, and trusted guidance.' }
            ].map((item, index) => (
              <div className='hv-row' key={item.title}>
                <div className='hv-avatar'>{index + 1}</div>
                <div>
                  <div className='hv-name'>{item.title}</div>
                  <div className='hv-sub'>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='trust-bar'>
        {[
          { icon: <FaCheckCircle />, text: 'Trusted Clinical Care' },
          { icon: <FaUserMd />, text: 'Experienced Specialists' },
          { icon: <FaClock />, text: '24/7 Emergency Support' },
          { icon: <FaStar />, text: 'Comprehensive Departments' },
          { icon: <FaPhone />, text: 'Patient Helpdesk Support' }
        ].map((item) => (
          <div className='trust-item' key={item.text}>
            <span className='trust-icon'>{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>

      <section className='section'>
        <div className='section-head'>
          <div className='section-label'>Our Specialities</div>
          <h2>Comprehensive care across every department</h2>
          <p className='section-sub'>
            From routine consultations to specialist departments, MEDIU supports a broad range of hospital services.
          </p>
        </div>

        <div className='services-grid'>
          {services.map((item) => (
            <div className='service-card' key={item.title}>
              <div className='service-icon' style={{ background: item.bg, color: item.color }}>
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='section why-section'>
        <div className='why-grid'>
          <div>
            <div className='section-label'>Why MEDIU</div>
            <h2>A hospital that puts care and clarity first</h2>
            <p className='section-sub'>
              MEDIU focuses on patient well-being through dependable clinical care, experienced teams, and a supportive hospital environment.
            </p>
            <ul className='why-list'>
              {whyPoints.map((item) => (
                <li className='why-item' key={item.title}>
                  <div className='why-item-icon'>{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className='why-image-block'>
            <FaHeartbeat style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.88 }} />
            <h3>Trusted care for every stage of treatment</h3>
            <p>
              From first consultation to follow-up care, MEDIU is committed to safe treatment and patient confidence.
            </p>
            <div className='stat-highlight'>
              <div className='stat-h-item'>
                <strong>24/7</strong>
                <span>Emergency support</span>
              </div>
              <div className='stat-h-item'>
                <strong>Expert</strong>
                <span>Clinical teams</span>
              </div>
              <div className='stat-h-item'>
                <strong>Modern</strong>
                <span>Hospital facilities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='testimonial-section'>
        <div className='section-head center'>
          <div className='section-label'>Patient Stories</div>
          <h2>Testimonials</h2>
        </div>
        <div className='testimonial-scroll'>
          {testimonials.map((item) => (
            <div className='testimonial-card' key={item.author}>
              <div className='quote-icon'>❝</div>
              <p className='quote-text'>{item.text}</p>
              <div className='quote-author'>— {item.author}</div>
            </div>
          ))}
        </div>
        <div className='quote-dots'>
          {[false, true, false].map((active, index) => (
            <div key={index} className={`quote-dot ${active ? 'active' : ''}`} />
          ))}
        </div>
      </section>

      <section className='section contact-section'>
        <div className='section-head center'>
          <div className='section-label'>Get In Touch</div>
          <h2>Contact</h2>
        </div>
        <div className='contact-grid'>
          {[
            { icon: <FaPhone />, label: 'Emergency', lines: ['(237) 681-812-255', '(237) 666-331-894'] },
            { icon: <FaMapMarkerAlt />, label: 'Location', lines: ['No. 45, Anna Nagar,', 'Madurai-625010'] },
            { icon: '✉️', label: 'Email', lines: ['info@mediuhospital.com', 'support@mediuhospital.com'] },
            { icon: <FaClock />, label: 'Working Hours', lines: ['Mon-Sat 09:00-20:00', 'Sunday Emergency only'] }
          ].map((item) => (
            <div className='contact-card' key={item.label}>
              <div className='contact-icon'>{item.icon}</div>
              <div className='contact-label'>{item.label}</div>
              <div className='contact-value'>
                {item.lines.map((line) => <div key={line}>{line}</div>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className='home-footer'>
        <div className='footer-grid'>
          <div>
            <div className='footer-logo'>MEDIU</div>
            <p className='footer-tagline'>Leading the Way in Medical Excellence, Trusted Care.</p>
          </div>
          <div>
            <div className='footer-heading'>Important Links</div>
            {['Appointment', 'Doctors', 'Services', 'About Us'].map((item) => (
              <a key={item} href='/' className='footer-link'>{item}</a>
            ))}
          </div>
          <div>
            <div className='footer-heading'>Contact Us</div>
            <div className='footer-contact'>
              Call: (237) 681-812-255
              <br />
              Email: info@mediuhospital.com
              <br />
              Address: No. 45, Anna Nagar,
              <br />
              Madurai-625010
            </div>
          </div>
          <div>
            <div className='footer-heading'>Newsletter</div>
            <div className='footer-newsletter-row'>
              <input className='footer-input' placeholder='Enter your email address' />
              <button className='footer-news-btn' type='button'><FaArrowRight /></button>
            </div>
          </div>
        </div>
        <div className='footer-divider'>
          <span className='footer-copy'>© 2026 MEDIU All Rights Reserved by PNTEC-LTD</span>
          <div className='footer-social'>
            {[FaLinkedin, FaFacebook, FaInstagram].map((Icon, index) => (
              <div className='footer-social-icon' key={index}><Icon /></div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
