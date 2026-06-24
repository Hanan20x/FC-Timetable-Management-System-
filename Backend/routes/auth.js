const express = require('express');
const router = express.Router();
const { login, profile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

router.post('/login', asyncHandler(login));
router.get('/profile', requireAuth, asyncHandler(profile));

module.exports = router;
