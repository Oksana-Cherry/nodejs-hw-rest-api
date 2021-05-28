const express = require('express'); // то что получили в app
const guard = require('../../../helpers/guard');
const router = express.Router();
const { validateSignup, validateLogin } = require('./validation');
const {
  signupRouter,
  loginRouter,
  logoutRouter,
  currentRouter,
} = require('../../../controllers/users.js');

// @POST /users/signup
router.post('/signup', validateSignup, signupRouter);

// @POST /users/login
router.post('/login', validateLogin, loginRouter);

// @POST / users / logout;
router.post('/logout', guard, logoutRouter);
router.post('/current', guard, currentRouter);

module.exports = router;
