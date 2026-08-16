const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

app.use('/api/auth', authRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'API rodando com sucesso' });
});

app.use('/api/posts', postRoutes);


module.exports = app;