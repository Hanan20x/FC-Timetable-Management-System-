require('dotenv').config();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  define: {
    underscored: true,
    timestamps: true,
  },
};

module.exports = {
  development: common,
  test: { ...common, database: `${process.env.DB_NAME}_test` },
  production: { ...common, logging: false },
};
