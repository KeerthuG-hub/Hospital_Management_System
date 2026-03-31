/**
 * MEDIU HMS – Database Seed Script
 * Run: node seed.js
 * This creates the mediu-hms database and inserts sample users, doctors, and patients.
 */

const mongoose = require('mongoose');
const app = require('./config').app;

// ── Models ──────────────────────────────────────────────────────────────────
const User = require('./user/models/user');
const Doctor = require('./doctor/models/doctor');
const Patient = require('./patient/models/patient');
const Appointment = require('./appointment/models/appointment');

async function seed() {
  try {
    await mongoose.connect(`mongodb://${app.dbDomain}:${app.port}/${app.dbName}`);
    console.log('✅ Connected to MongoDB → mediu-hms');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // ── Users (login accounts) ───────────────────────────────────────────────
    await User.insertMany([
      { username: 'admin',      password: 'admin123',  role: 'admin',   displayName: 'Main Admin', active: true },
      { username: 'dr.arjun',   password: 'doctor123', role: 'doctor',  displayName: 'Dr. Arjun Mehta', active: true },
      { username: 'dr.priya',   password: 'doctor456', role: 'doctor',  displayName: 'Dr. Priya Sharma', active: true },
      { username: 'ravi1',      password: 'pat123',    role: 'patient', displayName: 'Ravi Kumar', active: true },
      { username: 'ananya2',    password: 'pat456',    role: 'patient', displayName: 'Ananya Singh', active: true },
      { username: 'suresh3',    password: 'pat789',    role: 'patient', displayName: 'Suresh Nair', active: true },
      { username: 'divya4',     password: 'pat321',    role: 'patient', displayName: 'Divya Menon', active: true },
    ]);
    console.log('👤 Users seeded');

    // ── Doctors ──────────────────────────────────────────────────────────────
    await Doctor.insertMany([
      {
        doctorName: 'Dr. Arjun Mehta',
        specialization: 'Cardiology',
        phone: '9988776655',
        email: 'dr.arjun@mediu.in',
        shift: 'Morning',
        availabilitySlots: ['2026-04-08T09:30:00.000Z', '2026-04-08T11:00:00.000Z', '2026-04-09T15:30:00.000Z']
      },
      {
        doctorName: 'Dr. Priya Sharma',
        specialization: 'Endocrinology',
        phone: '9977665544',
        email: 'dr.priya@mediu.in',
        shift: 'Evening',
        availabilitySlots: ['2026-04-08T10:30:00.000Z', '2026-04-09T14:00:00.000Z', '2026-04-10T17:00:00.000Z']
      },
    ]);
    console.log('🩺 Doctors seeded');

    // ── Patients ─────────────────────────────────────────────────────────────
    // NOTE: doctorAssigned must exactly match the doctor's displayName for dashboard filtering
    await Patient.insertMany([
      {
        patientName: 'Ravi Kumar',
        age: 52,
        gender: 'Male',
        bloodGroup: 'B+',
        phone: '9876543210',
        address: '14 Gandhi Nagar, Chennai',
        diagnosis: 'Hypertension',
        doctorAssigned: 'Dr. Arjun Mehta',
        admissionDate: new Date('2026-03-18')
      },
      {
        patientName: 'Suresh Nair',
        age: 38,
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '9845123456',
        address: '7 Nehru Street, Coimbatore',
        diagnosis: 'Coronary Artery Disease',
        doctorAssigned: 'Dr. Arjun Mehta',
        admissionDate: new Date('2026-03-20')
      },
      {
        patientName: 'Ananya Singh',
        age: 29,
        gender: 'Female',
        bloodGroup: 'A+',
        phone: '9123456780',
        address: '22 Anna Nagar, Madurai',
        diagnosis: 'Diabetes Type 2',
        doctorAssigned: 'Dr. Priya Sharma',
        admissionDate: new Date('2026-03-22')
      },
      {
        patientName: 'Divya Menon',
        age: 41,
        gender: 'Female',
        bloodGroup: 'AB+',
        phone: '9001234567',
        address: '9 Velachery Main Rd, Chennai',
        diagnosis: 'Hypothyroidism',
        doctorAssigned: 'Dr. Priya Sharma',
        admissionDate: new Date('2026-03-23')
      }
    ]);
    console.log('🏥 Patients seeded');

    const patientUsers = await User.find({ role: 'patient' });
    const userMap = patientUsers.reduce((acc, user) => {
      acc[user.displayName] = String(user._id);
      return acc;
    }, {});

    await Appointment.insertMany([
      {
        patientUserId: userMap['Ravi Kumar'],
        patientName: 'Ravi Kumar',
        doctorName: 'Dr. Arjun Mehta',
        appointmentDate: new Date('2026-04-05T09:30:00'),
        reason: 'Blood pressure review',
        status: 'Confirmed',
        notes: 'Bring previous reports',
        prescription: 'Continue Amlodipine for 30 days'
      },
      {
        patientUserId: userMap['Suresh Nair'],
        patientName: 'Suresh Nair',
        doctorName: 'Dr. Arjun Mehta',
        appointmentDate: new Date('2026-04-08T11:00:00'),
        reason: 'Chest pain follow-up',
        status: 'Pending',
        notes: 'ECG review planned',
        prescription: ''
      },
      {
        patientUserId: userMap['Ananya Singh'],
        patientName: 'Ananya Singh',
        doctorName: 'Dr. Priya Sharma',
        appointmentDate: new Date('2026-04-06T17:00:00'),
        reason: 'Diabetes follow-up',
        status: 'Pending',
        notes: '',
        prescription: ''
      },
      {
        patientUserId: userMap['Divya Menon'],
        patientName: 'Divya Menon',
        doctorName: 'Dr. Priya Sharma',
        appointmentDate: new Date('2026-04-09T14:00:00'),
        reason: 'Thyroid medication review',
        status: 'Completed',
        notes: 'Lab values stable',
        prescription: 'Continue Levothyroxine for 60 days'
      }
    ]);
    console.log('📅 Appointments seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('   Login: dr.arjun / doctor123  → Sees Ravi Kumar, Suresh Nair');
    console.log('   Login: dr.priya / doctor456  → Sees Ananya Singh, Divya Menon');
    console.log('   Login: admin   / admin123    → Admin Dashboard');
    console.log('   Login: ravi1   / pat123       → Patient Dashboard');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
