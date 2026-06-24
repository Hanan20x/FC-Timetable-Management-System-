const express = require('express');
const router = express.Router();
const {
  listSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require('../controllers/scheduleController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

router.use(requireAuth);

router.get('/', asyncHandler(listSchedules));
router.get('/:id', asyncHandler(getSchedule));
router.post('/', requireRole('admin'), asyncHandler(createSchedule));
router.put('/:id', requireRole('admin'), asyncHandler(updateSchedule));
router.delete('/:id', requireRole('admin'), asyncHandler(deleteSchedule));

module.exports = router;
