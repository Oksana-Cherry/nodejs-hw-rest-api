const Contacts = require('../model/index');
const { HttpCode } = require('../helpers/constants');

// @ GET /api/contacts/
/* вызывает функцию listContacts для работы с json-файлом contacts.json
возвращает массив всех контактов в json-формате со статусом 200 */

const listContactsRouter = async (_req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { contacts },
    });
  } catch (error) {
    next(error);
  }
};
// @ GET /api/contacts/:contactId
// getContactById
const getContactByIdRouter = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    console.log(contact);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not Found',
    });
  } catch (error) {
    next(error);
  }
};

// @ POST /api/contacts
const addContactRouter = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { contact },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = HttpCode.BAD_REQUEST;
    }
    next(error);
  }
};

// @ DELETE /api/contacts/:contactId
const removeContactRouter = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'contact deleted',
        data: { contact },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not Found',
    });
  } catch (error) {
    next(error);
  }
};
// @ PUT /api/contacts/:contactId
// updateContact
const updateContactRouter = async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not Found',
    });
  } catch (error) {
    next(error);
  }
};
// @patch /api/contacts/:contactId/favorite
const updateStatusContactRouter = async (req, res, next) => {
  try {
    if (!req.body.favorite) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'missing field favorite',
      });
    }
    const contact = await Contacts.updateStatusContact(
      req.params.contactId,
      req.body,
    );
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contact } });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not Found',
    });
  } catch (error) {
    next(error);
  }
};
// функции контроллеры
module.exports = {
  listContactsRouter,
  getContactByIdRouter,
  addContactRouter,
  removeContactRouter,
  updateContactRouter,
  updateStatusContactRouter,
};
