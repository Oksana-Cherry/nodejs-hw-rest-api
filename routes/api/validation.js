const Joi = require('joi');

const schemaAddContact = Joi.object({
  /* password: Joi.string()   // строкой, накладывает патерн регулярки
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),// правила такие как в поле password

    access_token: [   // доступ
        Joi.string(),
        Joi.number()
    ],

    birth_year: Joi.number()  // день рожденье
        .integer()
        .min(1900)
        .max(2013), */
  // строкой , кол-во символов, и обязательное поле  username
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().required(), // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })  // кол-во символов , и какие символы
  phone: Joi.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(), // .number().integer().positive().min(4).max(10).required(),
  // favorite: Joi.boolean().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().optional(),
  phone: Joi.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/)
    .optional(), // .number().integer().positive().min(4).max(10).optional(),
  // favorite: Joi.boolean().optional(),
});

const schemaStatusFavoriteContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    // const [{ message }] = err.details;
    next({ status: 400, message: `Filed: ${err.message.replace(/"/g, '')}` });
  }
};

module.exports.validateAddContact = (req, _res, next) => {
  return validate(schemaAddContact, req.body, next);
};

module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};
module.exports.validateStatusFavoriteContact = (req, _res, next) => {
  return validate(schemaStatusFavoriteContact, req.body, next);
};
