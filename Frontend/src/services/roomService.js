import api from './api.js';

export async function listRooms() {
  const { data } = await api.get('/rooms');
  return data.rooms;
}

export async function createRoom(room) {
  const { data } = await api.post('/rooms', room);
  return data.room;
}

export async function updateRoom(id, updates) {
  const { data } = await api.put(`/rooms/${id}`, updates);
  return data.room;
}

export async function deleteRoom(id) {
  await api.delete(`/rooms/${id}`);
}
