const Joi = require('joi');

const schemaAddContact = Joi.object({
    name: Joi.string()// строкой , кол-во символов, и обязательное поле  username
       // .alphanum()
        .min(3)
        .max(30)
        .required(),

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

    email: Joi.string().email().required().required(), 
    // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })  // кол-во символов , и какие символы  
    phone: Joi.number().integer().positive().min(4).max(10).required(),
})
  const schemaUpdateContact = Joi.object({
    name: Joi.string().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.number().integer().positive().min(4).max(10).optional(),
})
    


const validate = async (schema,  body, next) => {
  try {
    await schema.validateAsync(body);
    next()
}
  catch (err) {
    // const [{ message }] = err.details;
    next({ status: 400, message: `Filed: ${err.message.replace(/"/g, '')}` })
 }
} 

module.exports.validateAddContact = (req, _res, next) => {
    return validate(schemaAddContact, req.body, next);
};

module.exports.validateUpdateContact = (req, _res, next) => {
    return validate(schemaUpdateContact, req.body, next);
};

  /* const validate = (schema, obj, next) => {
    const { error } = schema.validate(obj);
    if (error) {
        const [{ message }] = error.details;
        return next({
            status: 400,
            message: `Filed: ${message.replace(/"/g, '')}`,
        });
    }
    next();
}; */
  
  
  /* .with('name', 'birth_year')  // взаимозаменяемые поля
  .xor('password', 'access_token') // Взаимоисключающие поля
  .with('password', 'repeat_password');// оба поля обязательны */


/* schema.validate({ name: 'abc', birth_year: 1994 });
// -> { value: { username: 'abc', birth_year: 1994 } }

schema.validate({});
// -> { value: {}, error: '"username" is required' }
*/

