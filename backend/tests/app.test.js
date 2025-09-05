const request = require('supertest');
const app = require('../src/index');

describe('GET /', () => {
  it('responds with API status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'API running' });
  });
});
