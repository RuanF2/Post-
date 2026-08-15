const pool = require('../config/database');

async function criarUsuario(nome, email, senhaHash){
    const resultado = await pool.query('INSERT INTO users (nome, email, senha_Hash) VALUES($1, $2, $3) RETURNING id, nome, email, criado_em', [nome, email, senhaHash]);
    const busca = resultado.rows[0];
    return busca;
}

async function buscarPorEmail(email) {
    const resultado = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const busca = resultado.rows[0];
    return busca;
}

async function buscarPorId(id) {
    const resultado = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const busca = resultado.rows[0];
    return busca;
}

module.exports = { criarUsuario, buscarPorEmail, buscarPorId };