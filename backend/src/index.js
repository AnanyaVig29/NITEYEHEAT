const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');

const gazeRoutes = require('./routes/gaze');
const sessionRoutes = require('./routes/sessions');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const allowedOrigins = CLIENT_ORIGIN.split(',').map(o => o.trim());

app.use(cors({
  origin(origin, cb) {
    // Allow requests with no origin (curl, server-to-server)
    if (!origin) return cb(null, true);
    // Allow any localhost port during development
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '2mb' }));

app.use('/api/gaze', gazeRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', require('./routes/auth'));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'internal server error' });
});

function boot(startPort, maxAttempts = 20) {
  let attempts = 0;

  const start = (port) => {
    const server = app.listen(port, () => {
      console.log(`EyeHeat API running on :${port}`);
    });

    server.once('error', (err) => {
      if (err && err.code === 'EADDRINUSE' && attempts < maxAttempts - 1) {
        attempts += 1;
        const nextPort = port + 1;
        console.warn(`[api] Port ${port} is busy; trying ${nextPort}`);
        start(nextPort);
        return;
      }

      console.error('[api] Failed to start server', err);
      process.exit(1);
    });
  };

  start(startPort);
}

boot(PORT);
