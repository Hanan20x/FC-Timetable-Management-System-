const express = require('express');
const router = express.Router();
const {
  listRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController');
const { requireAuth, requireRole } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// All room routes require authentication; only admins can mutate.
router.use(requireAuth);

router.get('/', asyncHandler(listRooms));
router.get('/:id', asyncHandler(getRoom));
router.post('/', requireRole('admin'), asyncHandler(createRoom));
router.put('/:id', requireRole('admin'), asyncHandler(updateRoom));
router.delete('/:id', requireRole('admin'), asyncHandler(deleteRoom));

module.exports = router;
