const jwt = require('jsonwebtoken');
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signupRouter = async (req, res, next) => {
  try {
    const user = await Users.finByEmail(req.body.email);
    if (user) {
      // если такого пользователя нашли, тогда отказ
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email in use',
      });
    }
    // если нет,создадим нового пользователя
    const newUser = await Users.create(req.body);
    const { id, email, subscription } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id,
        email,
        subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};
const loginRouter = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.finByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      // если такого пользователя не нашли, тогда отказ
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Email or password is wrong',
      });
    }
    // если всё ок, отдать токен

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1w' });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
};
const logoutRouter = async (req, res, next) => {};
module.exports = {
  signupRouter,
  loginRouter,
  logoutRouter,
};
