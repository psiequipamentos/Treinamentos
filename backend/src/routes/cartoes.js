const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cartoes');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar cartões' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { perfil_id, nome, limite, tipo } = req.body;
    const [result] = await pool.query(
      'INSERT INTO cartoes (perfil_id, nome, limite, tipo) VALUES (?,?,?,?)',
      [perfil_id, nome, limite, tipo]
    );
    const [rows] = await pool.query('SELECT * FROM cartoes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar cartão' });
  }
});

module.exports = router;
