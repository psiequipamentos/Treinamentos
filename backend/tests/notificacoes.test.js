const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

const db = require('../src/config/db');
const app = require('../src/index');

describe('GET /notificacoes/saldo-critico', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    db.query.mockReset();
  });

  it('returns notifications when balance is below limit', async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    db.query.mockResolvedValueOnce([[{ id:1,banco:'Bank',conta:'123',saldo:50,perfil_nome:'Pessoal'}]]);

    const res = await request(app)
      .get('/notificacoes/saldo-critico?limite=100')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { mensagem: 'Saldo crítico na conta Bank 123 do perfil Pessoal: R$50' }
    ]);
  });

  it('rejects missing token', async () => {
    const res = await request(app).get('/notificacoes/saldo-critico');
    expect(res.status).toBe(401);
  });
});
