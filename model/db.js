// const {MongoClient} =require('mongodb')
// const { connect } = require('mongodb')
const mongoose = require('mongoose');
require('dotenv').config();
const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 5,
});
// события кодга подключаемся к базе данных
mongoose.connection.on('connected', () => {
  console.log('Database connection successful');
});
mongoose.connection.on('error', () => {
  console.log(`Mongoose connection error: ${Error.message}`);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', async () => {
  /* const client = await db
  client.close() */
  await mongoose.connection.close();
  console.log('Disconnect MongoDB');
  process.exit(1);
});

module.exports = db;
