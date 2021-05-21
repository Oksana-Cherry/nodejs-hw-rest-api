const express = require('express'); // то что получили в app
const router = express.Router();

const {
  signupRouter,
  loginRouter,
  logoutRouter,
} = require('../../../controllers/users.js');

// @POST /users/signup
router.post('./users/signup', signupRouter);

// @POST /users/login
router.post('./users/login', loginRouter);

// @POST / users / logout;
router.post('./users/logout', logoutRouter);

module.exports = router;
