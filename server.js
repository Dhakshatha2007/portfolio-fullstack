require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const projectsRouter = require('./routes/projects');
const contactRouter = require('./routes/contact');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // needed on Render/Vercel so req.ip is the visitor, not the proxy
app.use(express.json({ limit: '20kb' }));

// Frontend (used when running locally with `npm start`; on Vercel the public/
// folder is served directly by Vercel, not by this server)
app.use(express.static(path.join(__dirname, 'public')));

// API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'not connected' });
});
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

// Error handler
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
  if (err.code === 11000) return res.status(409).json({ error: 'A project with that slug already exists.' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// Keeps one database connection reused across requests, instead of
// reconnecting every time (important for serverless platforms like Vercel).
let connected = false;
async function ensureDbConnection() {
  if (connected && mongoose.connection.readyState === 1) return;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set.');
  await mongoose.connect(process.env.MONGODB_URI);
  connected = true;
}

module.exports = { app, ensureDbConnection };

// Only start a normal, always-on server when this file is run directly
// (locally with `npm start`, or on Render). Vercel imports `app` instead
// via api/index.js and never reaches this block.
if (require.main === module) {
  const port = process.env.PORT || 3000;
  ensureDbConnection()
    .then(() => app.listen(port, () => console.log(`Portfolio running on port ${port}`)))
    .catch((err) => {
      console.error('Could not connect to MongoDB:', err.message);
      process.exit(1);
    });
}
