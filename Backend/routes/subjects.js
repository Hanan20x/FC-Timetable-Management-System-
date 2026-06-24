const express = require('express');
const router = express.Router();
const {
  listSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

router.use(requireAuth);

router.get('/', asyncHandler(listSubjects));
router.get('/:id', asyncHandler(getSubject));
router.post('/', requireRole('admin'), asyncHandler(createSubject));
router.put('/:id', requireRole('admin'), asyncHandler(updateSubject));
router.delete('/:id', requireRole('admin'), asyncHandler(deleteSubject));

module.exports = router;
