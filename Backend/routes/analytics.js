const express = require('express');
const router = express.Router();
const {
  getUtilization,
  getConflicts,
  getSuggestions,
  getOverview,
} = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

router.use(requireAuth);

router.get('/', asyncHandler(getOverview));
router.get('/utilization', asyncHandler(getUtilization));
router.get('/conflicts', asyncHandler(getConflicts));
router.get('/suggestions', asyncHandler(getSuggestions));

module.exports = router;
