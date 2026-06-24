const { Op } = require('sequelize');
const { Schedule, Subject, Room, User, StudentCourse, LecturerCourse, Session } = require('../models');

const INCLUDE_RELATIONS = [
  { model: Subject, as: 'subject' },
  { model: Room, as: 'room' },
  { model: User, as: 'lecturer', attributes: { exclude: ['password_hash'] } },
  { model: Session, as: 'session' },
];

/**
 * GET /api/schedules
 * Query params:
 *   - scope=mine (default for non-admins) restricts to the authenticated user's
 *     own sessions (as student or lecturer). scope=all returns everything
 *     (admin only).
 *   - room_id, subject_id, day_of_week — optional filters
 */
async function listSchedules(req, res) {
  const { scope, room_id, subject_id, day_of_week } = req.query;
  const where = {};

  if (room_id) where.room_id = room_id;
  if (subject_id) where.subject_id = subject_id;
  if (day_of_week) where.day_of_week = day_of_week;

  const wantsAll = scope === 'all';
  if (wantsAll && req.user.user_type !== 'admin') {
    return res.status(403).json({ error: 'Only admins can view all sessions.' });
  }

  if (!wantsAll) {
    if (req.user.user_type === 'lecturer') {
      where.lecturer_id = req.user.id;
    } else if (req.user.user_type === 'student') {
      const enrollments = await StudentCourse.findAll({
        where: { student_id: req.user.id },
        attributes: ['subject_id'],
      });
      const subjectIds = enrollments.map((e) => e.subject_id);
      where.subject_id = { [Op.in]: subjectIds.length > 0 ? subjectIds : [-1] };
    }
    // admin with scope=mine (or omitted) falls through with no extra filter,
    // i.e. admins see everything by default too — matches the frontend mock behavior
  }

  const schedules = await Schedule.findAll({
    where,
    include: INCLUDE_RELATIONS,
    order: [['day_of_week', 'ASC'], ['time_slot', 'ASC']],
  });

  res.json({ schedules });
}

/** GET /api/schedules/:id */
async function getSchedule(req, res) {
  const schedule = await Schedule.findByPk(req.params.id, { include: INCLUDE_RELATIONS });
  if (!schedule) return res.status(404).json({ error: 'Schedule entry not found.' });
  res.json({ schedule });
}

/**
 * POST /api/schedules (admin only)
 * Creates a new timetable entry. Does not block on conflicts — conflicts are
 * surfaced separately via /api/analytics so admins can see and resolve them
 * deliberately rather than being blocked from saving a draft.
 */
async function createSchedule(req, res) {
  const { subject_id, room_id, lecturer_id, session_id, section, day_of_week, time_slot, span, enrolled } =
    req.body;

  if (!subject_id || !room_id || !lecturer_id || !session_id || !section || !day_of_week || !time_slot) {
    return res.status(400).json({
      error: 'subject_id, room_id, lecturer_id, session_id, section, day_of_week, and time_slot are required.',
    });
  }

  const schedule = await Schedule.create({
    subject_id,
    room_id,
    lecturer_id,
    session_id,
    section,
    day_of_week,
    time_slot,
    span: span || 1,
    enrolled: enrolled || 0,
  });

  const created = await Schedule.findByPk(schedule.id, { include: INCLUDE_RELATIONS });
  res.status(201).json({ schedule: created });
}

/** PUT /api/schedules/:id (admin only) */
async function updateSchedule(req, res) {
  const schedule = await Schedule.findByPk(req.params.id);
  if (!schedule) return res.status(404).json({ error: 'Schedule entry not found.' });

  const fields = [
    'subject_id',
    'room_id',
    'lecturer_id',
    'session_id',
    'section',
    'day_of_week',
    'time_slot',
    'span',
    'enrolled',
  ];
  for (const field of fields) {
    if (req.body[field] !== undefined) schedule[field] = req.body[field];
  }
  await schedule.save();

  const updated = await Schedule.findByPk(schedule.id, { include: INCLUDE_RELATIONS });
  res.json({ schedule: updated });
}

/** DELETE /api/schedules/:id (admin only) */
async function deleteSchedule(req, res) {
  const schedule = await Schedule.findByPk(req.params.id);
  if (!schedule) return res.status(404).json({ error: 'Schedule entry not found.' });
  await schedule.destroy();
  res.status(204).send();
}

module.exports = { listSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule };
