const { User } = require('../models');

/**
 * GET /api/users?user_type=student|lecturer|admin
 * Read-only listing, scrubbed of password_hash. There's no create/update/
 * delete here yet — user accounts are currently only created by the
 * seeder. Add those routes when self-registration or admin user
 * management becomes a real requirement.
 */
async function listUsers(req, res) {
  const where = {};
  if (req.query.user_type) where.user_type = req.query.user_type;

  const users = await User.findAll({
    where,
    attributes: { exclude: ['password_hash'] },
    order: [['full_name', 'ASC']],
  });
  res.json({ users });
}

module.exports = { listUsers };
