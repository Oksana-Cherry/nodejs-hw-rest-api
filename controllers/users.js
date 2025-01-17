const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
require('dotenv').config();
const Users = require('../model/users');
const { HttpCode } = require('../helpers/constants');
// const fs = require('fs').promises;
// const path = require('path');
// const UploadAvatar = require('../services/upload-avatars-local');
const UploadAvatar = require('../services/upload-avatars-cloud');
const EmailService = require('../services/email');
const {
  CreateSenderSendgrid,
  CreateSenderNodemailer,
} = require('../services/sender-email');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
// const AVATARS_OF_USERS = path.join('public', process.env.AVATARS_OF_USERS);
// облачное хранилище cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const signupRouter = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
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
    const { id, name, email, subscription, avatar, verifyToken } = newUser;
    // TODO: send email
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid(),
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
    } catch (e) {
      console.log(e.message); //спрятать ошибку
    }

    return res.status(HttpCode.CREATED).json({
      /// ???????????????????????
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id,
        name,
        email,
        subscription,
        avatar,
      },
    });
  } catch (e) {
    next(e);
  }
};
const loginRouter = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      //|| !user.verify
      // если такого пользователя не нашли, тогда отказ
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Email or password is wrong',
      });
    }
    if (!user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Check email for verification',
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
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const logoutRouter = async (req, res, next) => {
  await Users.updateToken(req.user.id, null);
  return res.status(HttpCode.NO_CONTENT).json({});
};
// /current
const currentRouter = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const current = await Users.findById(userId);

    if (current) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          email: current.email,
          subscription: current.subscription,
        },
      });
    } else {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'Unauthorized',
        message: 'Not authorized',
      });
    }
  } catch (e) {
    next(e);
  }
};
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    /* const tmp = new UploadAvatar(AVATARS_OF_USERS); 
    const avatarURL = await tmp.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatar, // останется в старом поле
    }); */
    const uploadCloud = promisify(cloudinary.uploader.upload);
    const tmp = new UploadAvatar(uploadCloud);
    const { userIdImg, avatarURL } = await tmp.saveAvatarToCloud(
      req.file.path,
      req.user.userIdImg,
    );
    await Users.updateAvatar(id, avatarURL, userIdImg);
    //  console.log(req.hostname, req.post);
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: { avatarURL },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.token);
    // console.log(contact);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful!',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User not found with verification token.',
    });
  } catch (error) {
    next(error);
  }
};

const repeatSendEmailVerify = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);
  if (user) {
    const { name, email, verifyToken, verify } = user;
    if (!verify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer(),
        );
        await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
        return res.status(HttpCode.OK).json({
          status: 'success',
          code: HttpCode.OK,
          message: 'Verification email resubmited!',
        });
      } catch (e) {
        console.log(e.message); //спрятать ошибку
        return next(e);
      }
    }
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email has already been verified',
    });
  }
  return res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'User not found.',
  });
};

module.exports = {
  signupRouter,
  loginRouter,
  logoutRouter,
  currentRouter,
  avatars,
  verify,
  repeatSendEmailVerify,
};
