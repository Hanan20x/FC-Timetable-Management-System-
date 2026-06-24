// Static scaffolding for the timetable grid — not mock data, just the fixed
// set of days/slots the UI renders columns and rows for. Both the frontend
// grid and the backend's analytics conflict-detection use the same handful
// of time slots conceptually, though the backend stores time_slot as a
// free-text label per row rather than validating against this exact list.

export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
]
