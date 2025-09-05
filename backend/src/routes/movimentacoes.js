const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM movimentacoes');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar movimentações' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      perfil_id,
      conta_id,
      cartao_id,
      categoria_id,
      data,
      valor,
      tipo,
      descricao,
      pago_com_perfil_id,
    } = req.body;

    const [result] = await pool.query(
      'INSERT INTO movimentacoes (perfil_id, conta_id, cartao_id, categoria_id, data, valor, tipo, descricao, pago_com_perfil_id) VALUES (?,?,?,?,?,?,?,?,?)',
      [
        perfil_id,
        conta_id || null,
        cartao_id || null,
        categoria_id,
        data,
        valor,
        tipo,
        descricao,
        pago_com_perfil_id || null,
      ]
    );

    // Ajuste automático se pago por outro perfil
    if (pago_com_perfil_id && pago_com_perfil_id !== perfil_id) {
      await pool.query(
        'INSERT INTO ajustes (origem_perfil_id, destino_perfil_id, valor, descricao) VALUES (?,?,?,?)',
        [
          pago_com_perfil_id,
          perfil_id,
          valor,
          `Ajuste automatico movimentacao ${result.insertId}`,
        ]
      );
    }

    const [rows] = await pool.query('SELECT * FROM movimentacoes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar movimentação' });
  }
});

module.exports = router;
