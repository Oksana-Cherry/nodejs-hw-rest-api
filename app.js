const express = require('express');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const boolParser = require('express-query-boolean');
const helmet = require('helmet');
const limiter = require('./helpers/limiter');
const { HttpCode } = require('./helpers/constants');
const contactsRouter = require('./routes/api/contacts'); // catsROUTER
const userRouter = require('./routes/api/users/');

const app = express(); // создали Экземпляр

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
// app.use(logger('combined'))//
app.use(helmet());
require('dotenv').config();
const AVATARS_OF_USERS = path.join('public', process.env.AVATARS_OF_USERS); // статика
app.use(express.static(path.join(__dirname, AVATARS_OF_USERS)));

//  apply to all requests
app.use(limiter);
app.get('env') !== 'test' && app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 15000 }));
app.use(boolParser());

app.use('/api/users', userRouter);
// роутер подключаем как Middleware(функции, которые последовательно
// вызываются в процессе обновления контейнера)
app.use('/api/contacts', contactsRouter);

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
    status,
    code,
    message: err.message,
  });
});
//  res.status(500).json({ message: err.message })
module.exports = app;
