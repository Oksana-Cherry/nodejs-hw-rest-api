const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const { HttpCode } = require('./helpers/constants');

const contactsRouter = require('./routes/api/contacts'); // catsROUTER
const userRouter = require('./routes/api/users');

const app = express(); // создали Экземпляр

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
// app.use(logger('combined'))//
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/contacts', contactsRouter); // роутер подключаем как Middleware(функции, которые последовательно вызываются в процессе обновления контейнера)
/*  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500 */

app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: 'Not found',
  }); //  message: 'Not found' обработка ошибки
});

app.use((err, _req, res, _next) => {
  // err.status = err.status ? err.status : HttpCode.INTERNAL_SERVER_ERROR
  const code = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  const status = err.status ? 'error' : 'fail';
  res.status(code).json({
    status: status,
    code: code,
    message: err.message,
  });
});
//  res.status(500).json({ message: err.message })
module.exports = app;
