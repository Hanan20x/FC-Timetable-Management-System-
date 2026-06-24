require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const sequelize = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const subjectRoutes = require('./routes/subjects');
const scheduleRoutes = require('./routes/schedules');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---------------------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === process.env.CORS_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// --- Health check --------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// --- 404 fallback ----------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: `No route found for ${req.method} ${req.originalUrl}` });
});

// --- Centralized error handler (must be last) -----------------------------
app.use(errorHandler);

// --- Start server -----------------------------------------------------------
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established.');

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✗ Unable to connect to the database:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
