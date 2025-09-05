// backend/src/index.js
const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Importa rotas
const perfisRoutes = require("./routes/perfis");
const contasRoutes = require("./routes/contas");
const movimentacoesRoutes = require("./routes/movimentacoes");

// Usa as rotas
app.use("/perfis", perfisRoutes);
app.use("/contas", contasRoutes);
app.use("/movimentacoes", movimentacoesRoutes);

// Rota default (teste)
app.get("/", (req, res) => {
  res.send("API rodando na Vercel 🚀");
});

// Exporta sem app.listen()
module.exports = app;
