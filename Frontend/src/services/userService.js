import api from './api.js';

export async function listUsers(userType) {
  const params = userType ? { user_type: userType } : {};
  const { data } = await api.get('/users', { params });
  return data.users;
}
