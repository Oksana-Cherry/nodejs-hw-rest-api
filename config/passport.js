const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt'); //
const Users = require('../model/users');

require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const params = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // в заголовках  Bearer JWT_TOKEN
  secretOrKey: JWT_SECRET_KEY,
};

passport.use(
  new Strategy(params, async (payload, done) => {
    // т.е payload расшифровать токен , в нем будет объект
    try {
      const user = await Users.findById(payload.id); // найти юзера id
      if (!user) {
        return done(new Error('Not authorized'), false); // не нашли, передать ошибку
      }

      if (!user.token) {
        return done(null, false); // нет токена , возвращаем без ошибки,
      }

      if (!user.verify) {
        return done(null, false);
      }

      return done(null, user); // вернём если всё хорошо
    } catch (err) {
      return done(err, false);
    }
  }),
);
