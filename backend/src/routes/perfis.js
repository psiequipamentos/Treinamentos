const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Lista todos os perfis
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM perfis');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar perfis' });
  }
});

// Cria um novo perfil
router.post('/', async (req, res) => {
  try {
    const { nome } = req.body;
    const [result] = await pool.query('INSERT INTO perfis (nome) VALUES (?)', [nome]);
    const [rows] = await pool.query('SELECT * FROM perfis WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar perfil' });
  }
});

module.exports = router;
