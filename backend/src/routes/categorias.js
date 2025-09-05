const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Lista todas as categorias
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Cria uma nova categoria
router.post('/', async (req, res) => {
  try {
    const { nome, tipo, perfil_id } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categorias (nome, tipo, perfil_id) VALUES (?,?,?)',
      [nome, tipo, perfil_id || null]
    );
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

module.exports = router;
