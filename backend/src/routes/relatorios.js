const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Retorna resumo de receitas, despesas e saldo opcionalmente filtrado por perfil
router.get('/resumo', async (req, res) => {
  try {
    const { perfil_id } = req.query;
    const params = [];
    let where = '';
    if (perfil_id) {
      where = 'WHERE perfil_id = ?';
      params.push(perfil_id);
    }

    const [rows] = await pool.query(
      `SELECT
         SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) AS receitas,
         SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) AS despesas
       FROM movimentacoes ${where}`,
      params
    );

    const receitas = rows[0].receitas || 0;
    const despesas = rows[0].despesas || 0;
    res.json({ receitas, despesas, saldo: receitas - despesas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao gerar resumo' });
  }
});

// Retorna despesas agrupadas por categoria opcionalmente filtradas por perfil
router.get('/por-categoria', async (req, res) => {
  try {
    const { perfil_id } = req.query;
    const params = [];
    let where = "WHERE m.tipo = 'despesa'";
    if (perfil_id) {
      where += ' AND m.perfil_id = ?';
      params.push(perfil_id);
    }

    const [rows] = await pool.query(
      `SELECT c.nome AS categoria, SUM(m.valor) AS total
       FROM movimentacoes m
       JOIN categorias c ON m.categoria_id = c.id
       ${where}
       GROUP BY c.nome`,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao agrupar por categoria' });
  }
});

module.exports = router;
