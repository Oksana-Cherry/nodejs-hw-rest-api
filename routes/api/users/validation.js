const Joi = require('joi');

const schemaSignup = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  subscription: Joi.string(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: `Filed: ${err.message.replace(/"/g, '')}` });
  }
};

module.exports.validateSignup = (req, _res, next) => {
  return validate(schemaSignup, req.body, next);
};

module.exports.validateLogin = (req, _res, next) => {
  return validate(schemaLogin, req.body, next);
};
