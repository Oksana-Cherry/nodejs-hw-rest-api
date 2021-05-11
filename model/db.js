 const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./model/contacts.json');
const db = low(adapter);

//  это contacts.json уже создан
  // db.defaults({ contacts: [] }).write();

module.exports = db; 