require('dotenv').config();

const express = require('express');
const cors = require('cors');

const gazeRoutes = require('./routes/gaze');
const sessionRoutes = require('./routes/sessions');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '2mb' }));

app.use('/api/gaze', gazeRoutes);
app.use('/api/sessions', sessionRoutes);
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

app.listen(PORT, () => {
  console.log(`EyeHeat API running on :${PORT}`);
});
