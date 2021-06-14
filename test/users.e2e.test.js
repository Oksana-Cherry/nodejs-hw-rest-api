const request = require('supertest');
const { newTestUser } = require('./data/data');
const { HttpCode } = require('../helpers/constants');
const app = require('../app');
const db = require('../model/db');
const User = require('../model/schemas/user');
const Users = require('../model/users');
const fs = require('fs/promises');

jest.mock('cloudinary');

describe('E2E test the routes api/users', () => {
  let token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newTestUser.email });
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newTestUser.email });
    await mongo.disconnect();
  });

  test('should response 201  signup user', async () => {
    const res = await request(app).post('/api/users/signup').send(newTestUser);

    expect(res.status).toEqual(HttpCode.CREATED);
    expect(res.body).toBeDefined();
  });

  test('should response 409  signup user', async () => {
    const res = await request(app).post('/api/users/signup').send(newTestUser);
    expect(res.status).toEqual(HttpCode.CONFLICT);
    expect(res.body).toBeDefined();
  });

  /* test('should response 200  login user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .set('Authorization', `Bearer ${token}`)
      .send(newTestUser);
    expect(res.status).toEqual(HttpCode.OK);
    expect(res.body).toBeDefined();
    token = res.body.data.token;
  });*/

  test('should response 401  login user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'fake@test.com', password: '1234567' });
    expect(res.status).toEqual(HttpCode.UNAUTHORIZED);
    expect(res.body).toBeDefined();
  });

  /* test('should response 200  upload avatar user', async () => {
    const buf = await fs.readFile('./test/data/default-avatar-female.jpg');
    const res = await request(app)
      .patch('/api/users/avatars')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', buf, 'default-avatar-female.jpg');
    expect(res.status).toEqual(HttpCode.OK);
    expect(res.body).toBeDefined();
    expect(res.body.data.avatarURL).toBeDefined(secureUrl);
  }); */
});
