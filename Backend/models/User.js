const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  /**
   * Compares a plaintext password against the stored bcrypt hash.
   */
  async verifyPassword(plaintext) {
    return bcrypt.compare(plaintext, this.password_hash);
  }

  /**
   * Returns a plain object safe to send to the client (no password hash).
   */
  toSafeJSON() {
    const { password_hash, ...safe } = this.toJSON();
    return safe;
  }
}

module.exports = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        // matric number for students (e.g. A22001), staff ID for lecturers/admins (e.g. STAFF1000)
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      user_type: {
        type: DataTypes.ENUM('student', 'lecturer', 'admin'),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      faculty_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        validate: { isEmail: true },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      hooks: {
        // Hash the password automatically whenever it's set or changed,
        // so callers always pass a plaintext `password` virtual field via setPassword().
      },
    }
  );

  /**
   * Helper to hash and assign a plaintext password. Use this instead of
   * setting password_hash directly so hashing logic lives in one place.
   */
  User.prototype.setPassword = async function (plaintextPassword) {
    const saltRounds = 10;
    this.password_hash = await bcrypt.hash(plaintextPassword, saltRounds);
  };

  return User;
};
