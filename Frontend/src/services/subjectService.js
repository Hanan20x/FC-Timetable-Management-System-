import api from './api.js';

export async function listSubjects() {
  const { data } = await api.get('/subjects');
  return data.subjects;
}
