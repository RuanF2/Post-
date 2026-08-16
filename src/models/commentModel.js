const pool = require('../config/database');

async function criarComentario(post_id, user_id, conteudo) {
    const resultado = await pool.query('INSERT INTO comments (post_id, user_id, conteudo) VALUES($1, $2, $3) RETURNING id, post_id, user_id, conteudo, criado_em', [post_id, user_id, conteudo]);
    const busca = resultado.rows[0];
    return busca
}

async function listarPorPost(post_id) {
    const resultado = await pool.query('SELECT comments.*, users.nome AS autor_nome FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = $1 ORDER BY comments.criado_em ASC', [post_id]);
    const busca = resultado.rows;
    return busca
}

async function deletarComentario(id) {
    const resultado = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    const busca = resultado.rowCount;
    return busca;
}

async function buscarPorId(id) {
    const resultado = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    const busca = resultado.rows[0];
    return busca;
    
}

module.exports = {criarComentario, listarPorPost, deletarComentario, buscarPorId};