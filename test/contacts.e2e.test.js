const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { newContact, newUser } = require('./data/data');
const { HttpCode } = require('../helpers/constants');
const app = require('../app');
const db = require('../model/db');
const Contact = require('../model/schemas/contact');
const User = require('../model/schemas/user');
const Users = require('../model/users');

describe('E2E test the routes api/contacts', () => {
  let user, token;
  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
    user = await Users.create(newUser);
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, JWT_SECRET_KEY);
    await Users.updateToken(user._id, token);
  });

  beforeEach(async () => {
    await Contact.deleteMany();
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect();
  });

  describe('should hendle get request', () => {
    test('should response 200 status for get all contacts', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contacts).toBeInstanceOf(Array);
    });
    test('should response 200 status for get contacts by id', async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });

      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact._id).toBe(String(contact._id));
    });
    test('should response 400 status for get contact by id', async () => {
      const res = await request(app)
        .get(`/api/contacts/123`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
      // expect(res.body.data.contact._id).toBe(String(contact._id));
    });
  });
  describe('should handle post request', () => {
    test('should response 201 status create newContact', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(newContact);

      expect(res.status).toEqual(HttpCode.CREATED);
      expect(res.body).toBeDefined();
    });
    test('should response 400 status without required field ', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ name: 'Toto' });

      expect(res.status).toEqual(HttpCode.BAD_REQUEST);
      expect(res.body).toBeDefined();
    });
  });
  describe('should hendle put request', () => {
    test('should response 200 status create contact', async () => {
      const contact = await Contact.create({
        ...newContact,
        owner: user._id,
      });
      const res = await request(app)
        .put(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send({ name: 'Boris' });

      expect(res.status).toEqual(HttpCode.OK);
      expect(res.body).toBeDefined();
      expect(res.body.data.contact.name).toBe('Boris');
    });
  });
  describe('should hendle delete request', () => {});
  describe('should hendle patch request', () => {});
});
