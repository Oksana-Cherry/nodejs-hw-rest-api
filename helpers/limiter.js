// можно использовать на url
const rateLimit = require('express-rate-limit');
const { HttpCode } = require('./constants');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 100 requests per windowMs
  handler: (_req, res) => {
    res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Too many requests, please try again later.',
    });
  },
});
module.exports = limiter;
