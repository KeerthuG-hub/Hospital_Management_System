const API_BASE_URL = 'http://localhost:3001/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error?.message || 'Something went wrong.');
  }

  return data.payload;
}

export function loginUser(credentials) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function getUsers(role) {
  const query = role ? `?role=${encodeURIComponent(role)}` : '';
  return request(`/user/${query}`);
}

export function registerUser(payload) {
  return request('/user/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateUser(id, payload) {
  return request(`/user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function getDoctors() {
  return request('/doctor/');
}

export function createDoctor(payload) {
  return request('/doctor/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateDoctor(id, payload) {
  return request(`/doctor/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function getPatients() {
  return request('/patient/');
}

export function getPatient(id) {
  return request(`/patient/${id}`);
}

export function createPatient(payload) {
  return request('/patient/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updatePatient(id, payload) {
  return request(`/patient/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deletePatient(id) {
  return request(`/patient/${id}`, {
    method: 'DELETE'
  });
}

export function getAppointments() {
  return request('/appointment/');
}

export function createAppointment(payload) {
  return request('/appointment/', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateAppointment(id, payload) {
  return request(`/appointment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}
