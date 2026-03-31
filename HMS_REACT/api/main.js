const express = require('express');
const dbHelper = require('./helpers/db-helper');
const bodyParser = require('body-parser');

const {
  patientList,
  addPatient,
  deletePatient,
  updatePatient,
  fetchSinglePatient
} = require('./patient/controllers/patient-controller');

const {
  doctorList,
  addDoctor,
  deleteDoctor,
  updateDoctor,
  fetchSingleDoctor
} = require('./doctor/controllers/doctor-controller');

const {
  appointmentList,
  addAppointment,
  deleteAppointment,
  updateAppointment,
  fetchSingleAppointment
} = require('./appointment/controllers/appointment-controller');

const {
  login,
  userList,
  registerUser,
  updateUser
} = require('./user/controllers/user-controller');

const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');
  next();
});

app.listen(3001, (err) => {
  if (err) {
    console.log('Server error', err);
    return;
  }
  console.log('MEDIU HMS API started on port 3001');
  dbHelper
    .connection()
    .then(() => {
      console.log('MongoDB connected to mediu-hms');

      // Auth
      app.post('/api/login', login);
      app.get('/api/user/', userList);
      app.post('/api/user/register', registerUser);
      app.put('/api/user/:id', updateUser);

      // Patient routes
      app.get('/api/patient/', patientList);
      app.post('/api/patient/', addPatient);
      app.get('/api/patient/:id', fetchSinglePatient);
      app.put('/api/patient/:id', updatePatient);
      app.delete('/api/patient/:id', deletePatient);

      // Doctor routes
      app.get('/api/doctor/', doctorList);
      app.post('/api/doctor/', addDoctor);
      app.get('/api/doctor/:id', fetchSingleDoctor);
      app.put('/api/doctor/:id', updateDoctor);
      app.delete('/api/doctor/:id', deleteDoctor);

      // Appointment routes
      app.get('/api/appointment/', appointmentList);
      app.post('/api/appointment/', addAppointment);
      app.get('/api/appointment/:id', fetchSingleAppointment);
      app.put('/api/appointment/:id', updateAppointment);
      app.delete('/api/appointment/:id', deleteAppointment);
    })
    .catch((err) => {
      console.log('DB connection failed:', err);
    });
});
