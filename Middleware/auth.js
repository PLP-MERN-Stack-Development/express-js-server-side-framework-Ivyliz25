// middleware/auth.js
const { UnauthorizedError } = require('../Utils/errors');

function auth(req, res, next) {
  const apiKey = req.header('x-api-key') || req.header('X-API-KEY');
  const expected = process.env.API_KEY || 'supersecretapikey123';

  if (!apiKey) {
    return next(new UnauthorizedError('API key missing'));
  }
  if (apiKey !== expected) {
    return next(new UnauthorizedError('Invalid API key'));
  }
  next();
}

module.exports = { auth };

