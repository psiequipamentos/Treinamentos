const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Exporta movimentações em formato CSV
router.get('/movimentacoes', async (req, res) => {
  const { perfil_id } = req.query;
  try {
    let query = 'SELECT * FROM movimentacoes';
    const params = [];
    if (perfil_id) {
      query += ' WHERE perfil_id = ?';
      params.push(perfil_id);
    }
    const [rows] = await pool.query(query, params);
    const headers = ['id','perfil_id','conta_id','cartao_id','categoria_id','data','valor','tipo','descricao','pago_com_perfil_id','criado_em'];
    const csvRows = [headers.join(',')];
    for (const row of rows) {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    res.header('Content-Type', 'text/csv');
    res.attachment('movimentacoes.csv');
    res.send(csvRows.join('\n'));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao exportar movimentações' });
  }
});

// Exporta movimentações em formato PDF
router.get('/movimentacoes/pdf', async (req, res) => {
  const { perfil_id } = req.query;
  try {
    let query = 'SELECT * FROM movimentacoes';
    const params = [];
    if (perfil_id) {
      query += ' WHERE perfil_id = ?';
      params.push(perfil_id);
    }
    const [rows] = await pool.query(query, params);
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.attachment('movimentacoes.pdf');
    doc.pipe(res);
    doc.fontSize(18).text('Movimentações', { align: 'center' });
    doc.moveDown();
    rows.forEach((row) => {
      doc.fontSize(12).text(`${row.data} - ${row.tipo} - ${row.valor}`);
    });
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao exportar movimentações em PDF' });
  }
});

// Exporta movimentações em formato Excel
router.get('/movimentacoes/excel', async (req, res) => {
  const { perfil_id } = req.query;
  try {
    let query = 'SELECT * FROM movimentacoes';
    const params = [];
    if (perfil_id) {
      query += ' WHERE perfil_id = ?';
      params.push(perfil_id);
    }
    const [rows] = await pool.query(query, params);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Movimentacoes');
    const headers = ['id','perfil_id','conta_id','cartao_id','categoria_id','data','valor','tipo','descricao','pago_com_perfil_id','criado_em'];
    sheet.addRow(headers);
    rows.forEach((row) => {
      sheet.addRow(headers.map(h => row[h]));
    });
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment('movimentacoes.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao exportar movimentações em Excel' });
  }
});

module.exports = router;
