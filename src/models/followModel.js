const pool = require('../config/database');

async function seguir(follower_id, following_id) {
    const resultado = await pool.query('INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) RETURNING id, follower_id, following_id, criado_em', [follower_id, following_id]);
    const busca = resultado.rows[0];
    return busca;
}

async function deixarDeSeguir(follower_id, following_id) {
    const resultado = await pool.query('DELETE FROM follows WHERE follower_id = $1 AND following_id = $2', [follower_id, following_id]);
    const busca = resultado.rowCount;
    return busca;
}

async function verificarSeguindo(follower_id, following_id) {
    const resultado = await pool.query('SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2', [follower_id, following_id]);
    const busca = resultado.rows[1];
    return busca;
}

async function listarSeguidores(user_id) {
    const resultado = await pool.query('SELECT * FROM follows WHERE following_id = $1', [user_id]);
    const busca = resultado.rows;
    return busca;
}

async function listarSeguindo(user_id) {
    const resultado = await pool.query('SELECT * FROM follows WHERE follower_id = $1', [user_id]);
    const busca = resultado.rows;
    return busca;
}

module.exports = { seguir, deixarDeSeguir, verificarSeguindo, listarSeguidores, listarSeguindo };