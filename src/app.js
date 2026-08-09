const express = require('express');
const path = require('path');

const app = express();

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (frontend e uploads)
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ status: 'API rodando com sucesso' });
});

module.exports = app;