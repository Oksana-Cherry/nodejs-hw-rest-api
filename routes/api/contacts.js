const express = require('express'); // то что получили в app
const router = express.Router();
const Contacts = require('../../model/index');
const {
  validateAddContact,
  validateUpdateContact,
  validateStatusFavoriteContact,
} = require('./validation');

const { HttpCode } = require('../../helpers/constants');
// const got = require('got')
// require('dotenv').config()
/*  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500 */

// @ GET /api/contacts/*ничего не получает
/* вызывает функцию listContacts для работы с json-файлом contacts.json
возвращает массив всех контактов в json-формате со статусом 200 */
router.get('/', async (_req, res, next) => {
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
});
// @ GET /api/contacts/:contactId
// getContactById
router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
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
});

// @ POST /api/contacts
router.post('/', validateAddContact, async (req, res, next) => {
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
});
// @ DELETE /api/contacts/:contactId

router.delete('/:contactId', async (req, res, next) => {
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
});
// @ PUT /api/contacts/:contactId
// updateContact
router.put('/:contactId', validateUpdateContact, async (req, res, next) => {
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
});

router.patch(
  '/:contactId/favorite',
  validateStatusFavoriteContact,
  async (req, res, next) => {
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
  },
);

module.exports = router;
