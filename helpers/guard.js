const passport = require('passport');
require('../config/passport');
const { HttpCode } = require('./constants');

const guard = (req, res, next) => {
  // console.log('Auth!!!'); // смотрим,проверяем токен
  passport.authenticate('jwt', { session: false }, (err, user) => {
    let token = null;
    if (req.get('Authorization')) {
      token = req.get('Authorization').split(' ')[1];
    }
    if (!user || err || token !== user.token) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Not authorized',
      });
    }
    // сохраняем
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = guard;
