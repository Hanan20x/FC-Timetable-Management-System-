const express = require('express');
const router = express.Router();
const { listUsers } = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

router.use(requireAuth);

router.get('/', asyncHandler(listUsers));

module.exports = router;
