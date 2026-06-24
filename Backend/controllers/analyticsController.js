const { Room, Schedule, Subject, User } = require('../models');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00',
];
const TOTAL_SLOTS_PER_WEEK = DAYS.length * TIME_SLOTS.length;

async function computeRoomUtilization() {
  const rooms = await Room.findAll();
  const schedules = await Schedule.findAll();

  return rooms.map((room) => {
    const roomSchedules = schedules.filter((s) => s.room_id === room.id);
    const slotsUsed = roomSchedules.reduce((sum, s) => sum + (s.span || 1), 0);
    const utilizationRate = Math.min(100, Math.round((slotsUsed / TOTAL_SLOTS_PER_WEEK) * 100));
    const avgFillRate =
      roomSchedules.length > 0
        ? Math.round(
            (roomSchedules.reduce((sum, s) => sum + s.enrolled / room.kapasiti, 0) /
              roomSchedules.length) *
              100
          )
        : 0;

    return {
      room,
      sessionsCount: roomSchedules.length,
      slotsUsed,
      utilizationRate,
      avgFillRate,
    };
  });
}

async function detectConflicts() {
  const schedules = await Schedule.findAll({
    include: [
      { model: Subject, as: 'subject' },
      { model: Room, as: 'room' },
      { model: User, as: 'lecturer', attributes: { exclude: ['password_hash'] } },
    ],
  });

  const conflicts = [];
  const byDaySlot = {};

  for (const s of schedules) {
    const key = `${s.day_of_week}__${s.time_slot}`;
    if (!byDaySlot[key]) byDaySlot[key] = [];
    byDaySlot[key].push(s);
  }

  for (const key of Object.keys(byDaySlot)) {
    const group = byDaySlot[key];
    if (group.length < 2) continue;

    // Room double-booking
    const roomMap = {};
    group.forEach((s) => {
      if (!roomMap[s.room_id]) roomMap[s.room_id] = [];
      roomMap[s.room_id].push(s);
    });
    Object.values(roomMap).forEach((items) => {
      if (items.length > 1) {
        conflicts.push({
          type: 'room_double_booking',
          severity: 'high',
          day: items[0].day_of_week,
          time_slot: items[0].time_slot,
          room: items[0].room,
          entries: items.map((s) => ({
            subject: s.subject,
            lecturer: s.lecturer,
            section: s.section,
          })),
        });
      }
    });

    // Lecturer double-booking
    const lecturerMap = {};
    group.forEach((s) => {
      if (!lecturerMap[s.lecturer_id]) lecturerMap[s.lecturer_id] = [];
      lecturerMap[s.lecturer_id].push(s);
    });
    Object.values(lecturerMap).forEach((items) => {
      if (items.length > 1) {
        conflicts.push({
          type: 'lecturer_double_booking',
          severity: 'high',
          day: items[0].day_of_week,
          time_slot: items[0].time_slot,
          lecturer: items[0].lecturer,
          entries: items.map((s) => ({
            subject: s.subject,
            room: s.room,
            section: s.section,
          })),
        });
      }
    });
  }

  // Capacity overflow
  for (const s of schedules) {
    if (s.room && s.enrolled > s.room.kapasiti) {
      conflicts.push({
        type: 'capacity_overflow',
        severity: 'medium',
        day: s.day_of_week,
        time_slot: s.time_slot,
        room: s.room,
        subject: s.subject,
        enrolled: s.enrolled,
        capacity: s.room.kapasiti,
      });
    }
  }

  return conflicts;
}

async function computeOptimizationSuggestions() {
  const utilization = await computeRoomUtilization();
  const conflicts = await detectConflicts();
  const suggestions = [];

  const underused = utilization.filter((u) => u.utilizationRate < 20 && u.sessionsCount > 0);
  const overused = utilization.filter((u) => u.utilizationRate > 70);

  if (overused.length > 0 && underused.length > 0) {
    suggestions.push({
      type: 'rebalance',
      message: `${overused[0].room.nama_ruang_singkatan} is booked ${overused[0].utilizationRate}% of available slots, while ${underused[0].room.nama_ruang_singkatan} sits at ${underused[0].utilizationRate}%. Consider moving a section across.`,
    });
  }

  const lowFill = utilization.filter((u) => u.sessionsCount > 0 && u.avgFillRate < 35);
  lowFill.forEach((u) => {
    suggestions.push({
      type: 'downsize',
      message: `${u.room.nama_ruang_singkatan} (capacity ${u.room.kapasiti}) averages only ${u.avgFillRate}% fill. A smaller room would free this space for higher-demand sections.`,
    });
  });

  if (conflicts.length > 0) {
    suggestions.push({
      type: 'resolve_conflicts',
      message: `${conflicts.length} scheduling conflict${conflicts.length > 1 ? 's' : ''} detected this week — review the Conflicts panel before publishing the timetable.`,
    });
  }

  return suggestions;
}

/** GET /api/analytics/utilization */
async function getUtilization(req, res) {
  const utilization = await computeRoomUtilization();
  res.json({ utilization });
}

/** GET /api/analytics/conflicts */
async function getConflicts(req, res) {
  const conflicts = await detectConflicts();
  res.json({ conflicts });
}

/** GET /api/analytics/suggestions */
async function getSuggestions(req, res) {
  const suggestions = await computeOptimizationSuggestions();
  res.json({ suggestions });
}

/** GET /api/analytics — everything in one call, mirrors the frontend's combined view */
async function getOverview(req, res) {
  const [utilization, conflicts, suggestions] = await Promise.all([
    computeRoomUtilization(),
    detectConflicts(),
    computeOptimizationSuggestions(),
  ]);
  res.json({ utilization, conflicts, suggestions });
}

module.exports = { getUtilization, getConflicts, getSuggestions, getOverview };
