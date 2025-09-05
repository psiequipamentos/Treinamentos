const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Lista ajustes
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ajustes');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar ajustes' });
  }
});

// Cria ajuste manual
router.post('/', async (req, res) => {
  try {
    const { origem_perfil_id, destino_perfil_id, valor, descricao } = req.body;
    const [result] = await pool.query(
      'INSERT INTO ajustes (origem_perfil_id, destino_perfil_id, valor, descricao) VALUES (?,?,?,?)',
      [origem_perfil_id, destino_perfil_id, valor, descricao]
    );
    const [rows] = await pool.query('SELECT * FROM ajustes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar ajuste' });
  }
});

module.exports = router;
