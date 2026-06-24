import api from './api.js';

/**
 * Fetches schedules. By default the backend scopes results to the
 * authenticated user's role (student sees their enrollments, lecturer sees
 * their teaching load). Pass { all: true } to request the unscoped view
 * (admin only — the backend enforces this and returns 403 otherwise).
 */
export async function listSchedules({ all = false, roomId, subjectId, dayOfWeek } = {}) {
  const params = {};
  if (all) params.scope = 'all';
  if (roomId) params.room_id = roomId;
  if (subjectId) params.subject_id = subjectId;
  if (dayOfWeek) params.day_of_week = dayOfWeek;

  const { data } = await api.get('/schedules', { params });
  return data.schedules;
}

export async function createSchedule(schedule) {
  const { data } = await api.post('/schedules', schedule);
  return data.schedule;
}

export async function updateSchedule(id, updates) {
  const { data } = await api.put(`/schedules/${id}`, updates);
  return data.schedule;
}

export async function deleteSchedule(id) {
  await api.delete(`/schedules/${id}`);
}
