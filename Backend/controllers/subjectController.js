const { Subject } = require('../models');

async function listSubjects(req, res) {
  const subjects = await Subject.findAll({ order: [['kod_subjek', 'ASC']] });
  res.json({ subjects });
}

async function getSubject(req, res) {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) return res.status(404).json({ error: 'Subject not found.' });
  res.json({ subject });
}

async function createSubject(req, res) {
  const { kod_subjek, nama_subjek, kredit, faculty_code } = req.body;
  if (!kod_subjek || !nama_subjek || !kredit) {
    return res.status(400).json({ error: 'kod_subjek, nama_subjek, and kredit are required.' });
  }
  const subject = await Subject.create({ kod_subjek, nama_subjek, kredit, faculty_code });
  res.status(201).json({ subject });
}

async function updateSubject(req, res) {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) return res.status(404).json({ error: 'Subject not found.' });

  const fields = ['kod_subjek', 'nama_subjek', 'kredit', 'faculty_code'];
  for (const field of fields) {
    if (req.body[field] !== undefined) subject[field] = req.body[field];
  }
  await subject.save();
  res.json({ subject });
}

async function deleteSubject(req, res) {
  const subject = await Subject.findByPk(req.params.id);
  if (!subject) return res.status(404).json({ error: 'Subject not found.' });
  await subject.destroy();
  res.status(204).send();
}

module.exports = { listSubjects, getSubject, createSubject, updateSubject, deleteSubject };
