const express = require('express'); // то что получили в app
const guard = require('../../../helpers/guard');
const router = express.Router();
const { validateSignup, validateLogin } = require('./validation');
const {
  signupRouter,
  loginRouter,
  logoutRouter,
  currentRouter,
  avatars,
} = require('../../../controllers/users.js');
const upload = require('../../../helpers/upload');

// @POST /users/signup
router.post('/signup', validateSignup, signupRouter);

// @POST /users/login
router.post('/login', validateLogin, loginRouter);

// @POST / users / logout;
router.post('/logout', guard, logoutRouter);
router.get('/current', guard, currentRouter);
router.patch('/avatars', [guard, upload.single('avatar')], avatars);

module.exports = router;
