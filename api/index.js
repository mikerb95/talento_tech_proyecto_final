// Vercel serverless entry: wraps the Express app
const app = require('../server');

module.exports = (req, res) => {
  // Strip /api prefix so Express routes '/cursos' etc. match
  if (req.url && req.url.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '') || '/';
  }
  return app(req, res);
};
