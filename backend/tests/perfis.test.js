const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

const db = require('../src/config/db');
const app = require('../src/index');

describe('GET /perfis', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    db.query.mockReset();
  });

  it('returns profiles when authenticated', async () => {
    const token = jwt.sign({ id: 1, nome: 'User' }, process.env.JWT_SECRET);
    db.query.mockResolvedValueOnce([[{ id: 1, nome: 'Pessoal' }]]);

    const res = await request(app)
      .get('/perfis')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, nome: 'Pessoal' }]);
  });

  it('rejects missing token', async () => {
    const res = await request(app).get('/perfis');
    expect(res.status).toBe(401);
  });
});
