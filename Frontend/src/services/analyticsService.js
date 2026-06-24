import api from './api.js';

export async function fetchAnalyticsOverview() {
  const { data } = await api.get('/analytics');
  return data; // { utilization, conflicts, suggestions }
}
