// Entry point Vercel uses to run the Express app as a serverless function.
// Every request to /api/* is routed here (see vercel.json).
const { app, ensureDbConnection } = require('../server');

module.exports = async (req, res) => {
  try {
    await ensureDbConnection();
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Database connection failed: ' + err.message }));
    return;
  }
  app(req, res);
};
