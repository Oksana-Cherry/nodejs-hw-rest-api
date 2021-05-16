const Contact = require('./schemas/contact');

/* const db = require('./db')
   const { ObjectId} = require('mongodb');const getCollection = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
}; */

const listContacts = async () => {
  //* const collection = await getCollection(db, 'contacts');
  //* const results = collection.find({}).toArray(); // преобразуй наш  курсор в массив   return results
  const results = await Contact.find({});
  return results; // return db.get('contacts').value();
};

const getContactById = async contactId => {
  /* const collection = await getCollection(db, 'contacts');
  // return db.find({ id: contactId }).value();
  const [result] = await collection
    .find({ _id: new ObjectId(contactId) })
    .toArray();
  console.log(result._id.getTimestamp()); // время создания */
  const result = await Contact.findOne({ _id: contactId });
  return result;
};

const removeContact = async contactId => {
  /*  const collection = await getCollection(db, 'contacts');
  // const [record] = db.get('contacts').remove({ id: contactId }).write();
  const { value: result } = await collection.findOneAndDelete({
    _id: new ObjectId(contactId),
  }); */
  const result = await Contact.findByIdAndRemove({ _id: contactId });
  return result;
};

const addContact = async body => {
  // create
  /* const collection = await getCollection(db, 'contacts');
  // const contactId = uuid();
  const record = {
    // id: contactId,
    ...body,
    // ...(body.isFavorite ? {} : { isFavorite: false }), *это всё за нас делает mongoose
  };
  const {
    ops: [result],
  } = await collection.insertOne(record); // db.get('contacts').push(record).write(); */

  const result = await Contact.create({ body });
  return result; // return record;}
};
const updateContact = async (contactId, body) => {
  /* const collection = await getCollection(db, 'contacts');
  // const record = db.find({ id: contactId }).assign(body).value()
  // db.write()
  // return record.id ? record : null
  const { value: result } = await collection.findOneAndUpdete(
    {
      _id: new ObjectId(contactId),
    },
    { $set: body },
    { returnOriginal: false },
  ); */
  const result = await Contact.findOneAndUpdate(
    { _id: contactId },
    { ...body },
    { new: true },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
