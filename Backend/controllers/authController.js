const { User } = require('../models');
const { signToken } = require('../middleware/jwt');

/**
 * POST /api/auth/login
 * Body: { username, password }
 */
async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    // Same generic message whether the user doesn't exist or the password is
    // wrong — don't leak which one it was.
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const isValid = await user.verifyPassword(password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = signToken(user);
  res.json({
    token,
    user: user.toSafeJSON(),
  });
}

/**
 * GET /api/auth/profile
 * Requires Authorization: Bearer <token> (verified by requireAuth middleware,
 * which already attached req.user).
 */
async function profile(req, res) {
  res.json({ user: req.user });
}

module.exports = { login, profile };
