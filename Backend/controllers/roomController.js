const { Room, Schedule } = require('../models');

const VALID_ROOM_TYPES = ['Lecture Hall', 'Classroom', 'Computer Lab', 'Seminar Room'];

function validateRoomInput(body, { partial = false } = {}) {
  const errors = [];
  const { kod_ruang, nama_ruang, nama_ruang_singkatan, kapasiti, jenis_ruang } = body;

  if (!partial || kod_ruang !== undefined) {
    if (!kod_ruang || typeof kod_ruang !== 'string') errors.push('kod_ruang is required.');
  }
  if (!partial || nama_ruang !== undefined) {
    if (!nama_ruang || typeof nama_ruang !== 'string') errors.push('nama_ruang is required.');
  }
  if (!partial || nama_ruang_singkatan !== undefined) {
    if (!nama_ruang_singkatan || typeof nama_ruang_singkatan !== 'string') {
      errors.push('nama_ruang_singkatan is required.');
    }
  }
  if (!partial || kapasiti !== undefined) {
    if (!Number.isInteger(kapasiti) || kapasiti < 1) {
      errors.push('kapasiti must be a positive integer.');
    }
  }
  if (!partial || jenis_ruang !== undefined) {
    if (!VALID_ROOM_TYPES.includes(jenis_ruang)) {
      errors.push(`jenis_ruang must be one of: ${VALID_ROOM_TYPES.join(', ')}.`);
    }
  }

  return errors;
}

/** GET /api/rooms */
async function listRooms(req, res) {
  const rooms = await Room.findAll({ order: [['kod_ruang', 'ASC']] });
  res.json({ rooms });
}

/** GET /api/rooms/:id */
async function getRoom(req, res) {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found.' });
  res.json({ room });
}

/** POST /api/rooms */
async function createRoom(req, res) {
  const errors = validateRoomInput(req.body);
  if (errors.length > 0) return res.status(400).json({ error: 'Validation failed.', details: errors });

  const existing = await Room.findOne({ where: { kod_ruang: req.body.kod_ruang } });
  if (existing) {
    return res.status(409).json({ error: `Room code "${req.body.kod_ruang}" already exists.` });
  }

  const room = await Room.create({
    kod_ruang: req.body.kod_ruang,
    nama_ruang: req.body.nama_ruang,
    nama_ruang_singkatan: req.body.nama_ruang_singkatan,
    kapasiti: req.body.kapasiti,
    jenis_ruang: req.body.jenis_ruang,
  });

  res.status(201).json({ room });
}

/** PUT /api/rooms/:id */
async function updateRoom(req, res) {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found.' });

  const errors = validateRoomInput(req.body, { partial: true });
  if (errors.length > 0) return res.status(400).json({ error: 'Validation failed.', details: errors });

  if (req.body.kod_ruang && req.body.kod_ruang !== room.kod_ruang) {
    const existing = await Room.findOne({ where: { kod_ruang: req.body.kod_ruang } });
    if (existing) {
      return res.status(409).json({ error: `Room code "${req.body.kod_ruang}" already exists.` });
    }
  }

  const fields = ['kod_ruang', 'nama_ruang', 'nama_ruang_singkatan', 'kapasiti', 'jenis_ruang'];
  for (const field of fields) {
    if (req.body[field] !== undefined) room[field] = req.body[field];
  }
  await room.save();

  res.json({ room });
}

/** DELETE /api/rooms/:id */
async function deleteRoom(req, res) {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found.' });

  const scheduleCount = await Schedule.count({ where: { room_id: room.id } });
  if (scheduleCount > 0) {
    return res.status(409).json({
      error: `Cannot delete this room — it has ${scheduleCount} scheduled session(s). Remove those first.`,
    });
  }

  await room.destroy();
  res.status(204).send();
}

module.exports = { listRooms, getRoom, createRoom, updateRoom, deleteRoom };
