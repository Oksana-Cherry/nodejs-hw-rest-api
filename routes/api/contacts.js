const express = require('express')// то что получили в app
const router = express.Router()
const Contacts = require('../../model/index')
const {
  validateAddContact,
 validateUpdateContact,
} = require('./validation')

const { HttpCode } = require('../../helpers/constants')
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
    const contacts = await Contacts.listContacts()
    return res
      .json({
      status: 'success',
      code: HttpCode.OK,
      data: contacts,
    })
  }catch(e){
    next(e)
   }
})
// @ GET /api/contacts/:contactId
// getContactById
router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: contact,
       
      })
    }  return res.status(HttpCode.NOT_FOUND).json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not Found',
      });
  
    }catch (e) {
      next(e)
    }
  });

// @ POST /api/contacts
router.post('/', validateAddContact, async (req, res, next) => {
   try {
  const contact = await Contacts.addContact(req.body)
     return res
       .status(HttpCode.CREATED)
       .json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {contact},   
    })
  }catch(e){
    next(e)
   }
})
// @ DELETE /api/contacts/:contactId

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId)
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({
          status: 'success',
          code: HttpCode.OK,
          message: 'contact deleted',
          data:{contact},
        })
     }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        message: 'Not Found',
      });
  } catch (e) {
    next(e)
  }
})
// @ PUT /api/contacts/:contactId
// updateContact
router.put('/:contactId', validateUpdateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );

    /* if (!req.body) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'missing fields',
            });
         } */
    
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({
          status: 'success',
          code: HttpCode.OK,
          data: contact,
        });
     }return res
        .status(HttpCode.NOT_FOUND)
        .json({
           status: 'error',
           code: HttpCode.NOT_FOUND,
           message: 'Not Found',
             });
  
    }catch (e) {
      next(e)
    }
})
/* router.patch('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
}) */

module.exports = router
