const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  // Fail loudly at boot rather than silently signing tokens with `undefined`
  throw new Error('JWT_SECRET is not set. Add it to your .env file.');
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      user_type: user.user_type,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
