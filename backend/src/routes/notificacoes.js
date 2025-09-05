const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Lista contas cujo saldo está abaixo ou igual ao limite informado
router.get('/saldo-critico', async (req, res) => {
  const limite = Number(req.query.limite || 0);
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.banco, c.conta, c.saldo, p.nome AS perfil_nome
       FROM contas c JOIN perfis p ON c.perfil_id = p.id
       WHERE c.saldo <= ?`,
      [limite]
    );
    const notificacoes = rows.map(r => ({
      mensagem: `Saldo crítico na conta ${r.banco || ''} ${r.conta || ''} do perfil ${r.perfil_nome}: R$${r.saldo}`
    }));
    res.json(notificacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao verificar saldos' });
  }
});

module.exports = router;
