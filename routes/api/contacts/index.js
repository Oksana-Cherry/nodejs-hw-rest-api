const express = require('express'); // то что получили в app
const router = express.Router();
// const Contacts = require('../../../model/index');
const {
  listContactsRouter,
  getContactByIdRouter,
  addContactRouter,
  removeContactRouter,
  updateContactRouter,
  updateStatusContactRouter,
} = require('../../../controllers/contacts');
const guard = require('../../../helpers/guard');
const {
  validateAddContact,
  validateStatusFavoriteContact,
  validateUpdateContact,
  validateObjectId,
} = require('./validation');

// @ GET /api/contacts/*ничего не получает
/* вызывает функцию listContacts для работы с json-файлом contacts.json
возвращает массив всех контактов в json-формате со статусом 200 */
router.get('/', guard, listContactsRouter);
// @ GET /api/contacts/:contactId
// getContactById
router.get('/:contactId', guard, validateObjectId, getContactByIdRouter);

// @ POST /api/contacts
router.post('/', guard, validateAddContact, addContactRouter);

// @ DELETE /api/contacts/:contactId
router.delete('/:contactId', guard, validateObjectId, removeContactRouter);

// @ PUT /api/contacts/:contactId
// updateContact
router.put(
  '/:contactId',
  guard,
  validateObjectId,
  validateUpdateContact,
  updateContactRouter,
);

// @patch /api/contacts/:contactId/favorite
router.patch(
  '/:contactId/favorite',
  guard,
  validateObjectId,
  validateStatusFavoriteContact,
  updateStatusContactRouter,
);

module.exports = router;
