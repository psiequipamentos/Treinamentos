const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

const db = require('../src/config/db');
const app = require('../src/index');

describe('GET /exportacao/movimentacoes', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    db.query.mockReset();
  });

  it('returns CSV with movements', async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    db.query.mockResolvedValueOnce([[{ id:1,perfil_id:1,conta_id:null,cartao_id:null,categoria_id:1,data:'2024-01-01',valor:100,tipo:'receita',descricao:'',pago_com_perfil_id:null,criado_em:'2024-01-01' }]]);

    const res = await request(app)
      .get('/exportacao/movimentacoes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    const lines = res.text.trim().split('\n');
    expect(lines[0]).toBe('id,perfil_id,conta_id,cartao_id,categoria_id,data,valor,tipo,descricao,pago_com_perfil_id,criado_em');
    expect(lines[1]).toBe('"1","1",,,"1","2024-01-01","100","receita","",,"2024-01-01"');
  });

  it('rejects missing token', async () => {
    const res = await request(app).get('/exportacao/movimentacoes');
    expect(res.status).toBe(401);
  });
});

describe('GET /exportacao/movimentacoes/pdf', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    db.query.mockReset();
  });

  it('returns PDF with movements', async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    db.query.mockResolvedValueOnce([[{ id: 1, data: '2024-01-01', tipo: 'receita', valor: 100 }]]);

    const res = await request(app)
      .get('/exportacao/movimentacoes/pdf')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /exportacao/movimentacoes/excel', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    db.query.mockReset();
  });

  it('returns Excel with movements', async () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    db.query.mockResolvedValueOnce([[{ id:1,perfil_id:1,conta_id:null,cartao_id:null,categoria_id:1,data:'2024-01-01',valor:100,tipo:'receita',descricao:'',pago_com_perfil_id:null,criado_em:'2024-01-01' }]]);

    const res = await request(app)
      .get('/exportacao/movimentacoes/excel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(res.headers['content-disposition']).toContain('movimentacoes.xlsx');
  });
});
