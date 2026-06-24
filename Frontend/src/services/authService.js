import api from './api.js';

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  return data; // { token, user }
}

export async function fetchProfile() {
  const { data } = await api.get('/auth/profile');
  return data.user;
}
