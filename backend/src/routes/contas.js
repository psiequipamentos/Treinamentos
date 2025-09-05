const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contas');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar contas' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { perfil_id, banco, agencia, conta, saldo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO contas (perfil_id, banco, agencia, conta, saldo) VALUES (?,?,?,?,?)',
      [perfil_id, banco, agencia, conta, saldo]
    );
    const [rows] = await pool.query('SELECT * FROM contas WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
});

module.exports = router;
