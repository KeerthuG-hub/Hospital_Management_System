const STORAGE_KEY = 'mediuUser';

export function getCurrentUser() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setCurrentUser(user) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getDashboardPath(role) {
  if (role === 'admin') return '/admin-dashboard';
  if (role === 'doctor') return '/doctor-dashboard';
  return '/patient-dashboard';
}
