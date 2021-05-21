const passport = require('passport');
require('../config/passport');
const guard = (req, res, next) => {
  // console.log('Auth!!!'); // смотрим,проверяем токен

  passport.authenticate('jwt', { session: false })(req, res, next);
  next();
};

module.exports = guard;
