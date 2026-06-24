const { verifyToken } = require('./jwt');
const { User } = require('../models');

/**
 * Requires a valid JWT in the Authorization header (Bearer <token>).
 * Attaches the authenticated user (without password_hash) to req.user.
 */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header.' });
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const user = await User.findByPk(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = user.toSafeJSON();
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Restricts a route to one or more user_type values.
 * Usage: requireRole('admin') or requireRole('admin', 'lecturer')
 */
function requireRole(...allowedTypes) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedTypes.includes(req.user.user_type)) {
      return res.status(403).json({ error: 'You do not have permission to perform this action.' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
