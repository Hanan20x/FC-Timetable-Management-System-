// Analytics derivations — pure functions over the schedule data.
//
// STATUS: this logic has been ported to Backend/controllers/analyticsController.js
// and is what /api/analytics actually runs now. This file is no longer
// imported by the live app — kept as an offline fixture alongside mockData.js.

import { rooms, schedules, days, timeSlots, getRoom, getSubject, getLecturer } from './mockData.js'

const TOTAL_SLOTS_PER_WEEK = days.length * timeSlots.length

export function computeRoomUtilization() {
  return rooms.map((room) => {
    const roomSchedules = schedules.filter((s) => s.room_id === room.id)
    const slotsUsed = roomSchedules.reduce((sum, s) => sum + (s.span || 1), 0)
    const rate = Math.min(100, Math.round((slotsUsed / TOTAL_SLOTS_PER_WEEK) * 100))
    const avgFill =
      roomSchedules.length > 0
        ? Math.round(
            roomSchedules.reduce((sum, s) => sum + s.enrolled / room.kapasiti, 0) /
              roomSchedules.length *
              100
          )
        : 0
    return {
      room,
      sessionsCount: roomSchedules.length,
      slotsUsed,
      utilizationRate: rate,
      avgFillRate: avgFill,
    }
  })
}

export function detectConflicts() {
  const conflicts = []

  // Group by day + time_slot to find overlaps
  const byDaySlot = {}
  for (const s of schedules) {
    const key = `${s.day_of_week}__${s.time_slot}`
    if (!byDaySlot[key]) byDaySlot[key] = []
    byDaySlot[key].push(s)
  }

  for (const key of Object.keys(byDaySlot)) {
    const group = byDaySlot[key]
    if (group.length < 2) continue

    // Room double-booking
    const roomMap = {}
    group.forEach((s) => {
      if (!roomMap[s.room_id]) roomMap[s.room_id] = []
      roomMap[s.room_id].push(s)
    })
    Object.entries(roomMap).forEach(([roomId, items]) => {
      if (items.length > 1) {
        conflicts.push({
          type: 'room_double_booking',
          severity: 'high',
          day: items[0].day_of_week,
          time_slot: items[0].time_slot,
          room: getRoom(Number(roomId)),
          entries: items.map((s) => ({
            subject: getSubject(s.subject_id),
            lecturer: getLecturer(s.lecturer_id),
            section: s.section,
          })),
        })
      }
    })

    // Lecturer double-booking
    const lecturerMap = {}
    group.forEach((s) => {
      if (!lecturerMap[s.lecturer_id]) lecturerMap[s.lecturer_id] = []
      lecturerMap[s.lecturer_id].push(s)
    })
    Object.entries(lecturerMap).forEach(([lecturerId, items]) => {
      if (items.length > 1) {
        conflicts.push({
          type: 'lecturer_double_booking',
          severity: 'high',
          day: items[0].day_of_week,
          time_slot: items[0].time_slot,
          lecturer: getLecturer(Number(lecturerId)),
          entries: items.map((s) => ({
            subject: getSubject(s.subject_id),
            room: getRoom(s.room_id),
            section: s.section,
          })),
        })
      }
    })
  }

  // Capacity overflow (enrolled > room capacity)
  schedules.forEach((s) => {
    const room = getRoom(s.room_id)
    if (room && s.enrolled > room.kapasiti) {
      conflicts.push({
        type: 'capacity_overflow',
        severity: 'medium',
        day: s.day_of_week,
        time_slot: s.time_slot,
        room,
        subject: getSubject(s.subject_id),
        enrolled: s.enrolled,
        capacity: room.kapasiti,
      })
    }
  })

  return conflicts
}

export function computeOptimizationSuggestions() {
  const utilization = computeRoomUtilization()
  const suggestions = []

  const underused = utilization.filter((u) => u.utilizationRate < 20 && u.sessionsCount > 0)
  const overused = utilization.filter((u) => u.utilizationRate > 70)

  if (overused.length > 0 && underused.length > 0) {
    suggestions.push({
      type: 'rebalance',
      message: `${overused[0].room.nama_ruang_singkatan} is booked ${overused[0].utilizationRate}% of available slots, while ${underused[0].room.nama_ruang_singkatan} sits at ${underused[0].utilizationRate}%. Consider moving a section across.`,
    })
  }

  const lowFill = utilization.filter((u) => u.sessionsCount > 0 && u.avgFillRate < 35)
  lowFill.forEach((u) => {
    suggestions.push({
      type: 'downsize',
      message: `${u.room.nama_ruang_singkatan} (capacity ${u.room.kapasiti}) averages only ${u.avgFillRate}% fill. A smaller room would free this space for higher-demand sections.`,
    })
  })

  const conflicts = detectConflicts()
  if (conflicts.length > 0) {
    suggestions.push({
      type: 'resolve_conflicts',
      message: `${conflicts.length} scheduling conflict${conflicts.length > 1 ? 's' : ''} detected this week — review the Conflicts panel before publishing the timetable.`,
    })
  }

  return suggestions
}
