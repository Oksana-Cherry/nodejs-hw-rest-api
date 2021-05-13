// const fs = require('fs/promises')

 const db = require('./db');
 const { v4: uuid } = require('uuid');
// (MODEL cats.JS)


const listContacts = async () => {
    return db.value();   // у еас уже есть json поэтому не нужен .get('contacts')
 }

const getContactById = async (contactId) => {
      return db.find({ id: contactId }).value();
}

const removeContact = async (contactId) => {
  const [record] = db.remove({ id: contactId }).write();
  return record;
}

const addContact = async (body) => {
   const contactId = uuid();
    const record = {
        id: contactId,
        ...body,
    };
    db.push(record).write();// .get('contacts') не нужно так как есть JSON;
    return record;

}


const updateContact = async (contactId, body) => {
  const record = db.find({ id: contactId }).assign(body).value()
  db.write()
  return record.id ? record : null
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} 





// // РАБОТА С ФАЙЛАМИ
 /* const fs = require('fs/promises')
const path = require('path')
 
  const contactsPath = path.join(__dirname,
  './model/contacts.json'
)
// getall
const listContacts = async () => {
  try {
    const response = await fs.readFile(contactsPath);
      const contacts = JSON.parse(response);
    return contacts;
  } catch (err) {
    console.error(err.message);
  }
}

const getContactById = async (contactId) => {}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} */
