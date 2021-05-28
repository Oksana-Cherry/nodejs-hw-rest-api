const Contact = require('./schemas/contact');

const listContacts = async (userId, query) => {
  const {
    limit = 5,
    page = 1,
    sortBy,
    sortByDesc,
    filter, // name|
    favorite = null,
  } = query;

  console.log(Boolean(favorite));
  const optionsSerch = { owner: userId };
  if (favorite !== null) {
    optionsSerch.favorite = favorite;
  }

  const results = await Contact.paginate(optionsSerch, {
    limit,
    page,
    // фильтратиция по полю (не по тексту)
    select: filter ? filter.split('|').join(' ') : '',
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    }, // name:1 // name:-1
  });
  /* .populate({
    path: 'owner',
    select: 'email subscription -_id',
  }); */
  const { docs: contacts, totalDocs: total } = results;
  return { contacts, total, limit, page };
};

const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email subscription -_id',
  }); // путь, какие поля
  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Contact.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};

const addContact = async body => {
  // create
  const result = await Contact.create(body);
  return result; // return record;}
};
const updateContact = async (userId, contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true },
    );
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

/* const updateStatusContact = async (userId, contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      { _id: contactId, owner: userId },
      { ...body },
      { new: true },
    );
    return result;
  } catch (error) {
    console.log(error.message);
  }
}; */

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  // updateStatusContact,
  removeContact,
};
