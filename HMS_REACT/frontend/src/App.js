import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import RegisterPatient from './pages/RegisterPatient';
import SavePatient from './pages/SavePatient';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/patient-register' element={<RegisterPatient />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
        <Route path='/patient-dashboard' element={<PatientDashboard />} />
        <Route path='/save-patient' element={<SavePatient />} />
        <Route path='/save-patient/:id' element={<SavePatient />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
