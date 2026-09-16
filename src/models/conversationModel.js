const pool = require('../config/database');

async function criarConversa(usuario1_id, usuario2_id) {
    const resultado = await pool.query('INSERT INTO conversations (usuario1_id, usuario2_id) VALUES ($1, $2) RETURNING id, usuario1_id, usuario2_id, criado_em ', [usuario1_id, usuario2_id]);
    const busca = resultado.rows[0];
    return busca;
}



async function buscarConversaEntre(usuario1_id, usuario2_id) {
    const resultado = await pool.query('SELECT * FROM conversations WHERE (usuario1_id = $1 AND usuario2_id = $2) OR (usuario1_id = $2 AND usuario2_id = $1)', [usuario1_id, usuario2_id]);
    const busca = resultado.rows[0];
    return busca;
}

async function listarConversasDoUsuario(userId) {
    const resultado = await pool.query('SELECT * FROM conversations WHERE usuario1_id = $1 OR usuario2_id = $1 ', [userId]);
    const busca = resultado.rows;
    return busca;
}

module.exports = { criarConversa, buscarConversaEntre, listarConversasDoUsuario };