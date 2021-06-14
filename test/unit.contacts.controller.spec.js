const { updateContactRouter } = require('../controllers/contacts');
const Contacts = require('../model/index');
const { HttpCode } = require('../helpers/constants');

jest.mock('../model/index');

describe('Unit test contacts controllers', () => {
  const req = { user: { id: 1 }, boby: {}, params: { contactId: 3 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(data => data),
  };
  const next = jest.fn();

  test('without contact in Db', async () => {
    Contacts.updateContact = jest.fn();
    const result = await updateContactRouter(req, res, next);
    expect(result.status).toEqual('error');
    expect(result.code).toEqual(HttpCode.NOT_FOUND);
    expect(result.message).toEqual('Not Found');
  });
  test('Db return an exception', async () => {
    Contacts.updateContact = jest.fn(() => {
      throw new Error('Ups');
    });
    await updateContactRouter(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
