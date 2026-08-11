const pool = require('../config/database');

async function darLike(user_id, post_id) {
    const resultado = await pool.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING id, user_id, post_id, criado_em', [user_id, post_id]);
    const busca = resultado.rows[0];
    return busca;
}

async function removerLike(user_id, post_id) {
    const resultado = await pool.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);
    const busca = resultado.rowCount;
    return busca;
}

async function verificarLike(user_id, post_id) {
    const resultado = await pool.query('SELECT * FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);
    const busca = resultado.rows[0];
    return busca;
}

async function contarLikes(post_id) {
    const resultado = await pool.query('SELECT COUNT(*) FROM likes WHERE post_id = $1', [post_id]);
    const busca = resultado.rows[0];
    return busca;
}

module.exports = { darLike, removerLike, verificarLike, contarLikes };