const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

const perfisRouter = require('./routes/perfis');
const contasRouter = require('./routes/contas');
const cartoesRouter = require('./routes/cartoes');
const movimentacoesRouter = require('./routes/movimentacoes');
const categoriasRouter = require('./routes/categorias');
const ajustesRouter = require('./routes/ajustes');
const relatoriosRouter = require('./routes/relatorios');
const exportacaoRouter = require('./routes/exportacao');
const notificacoesRouter = require('./routes/notificacoes');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

app.use('/auth', authRouter);

app.use('/perfis', authMiddleware, perfisRouter);
app.use('/contas', authMiddleware, contasRouter);
app.use('/cartoes', authMiddleware, cartoesRouter);
app.use('/movimentacoes', authMiddleware, movimentacoesRouter);
app.use('/categorias', authMiddleware, categoriasRouter);
app.use('/ajustes', authMiddleware, ajustesRouter);
app.use('/relatorios', authMiddleware, relatoriosRouter);
app.use('/exportacao', authMiddleware, exportacaoRouter);
app.use('/notificacoes', authMiddleware, notificacoesRouter);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
