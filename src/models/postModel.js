const pool = require('../config/database');

async function criarPost(user_id, conteudo, imagem_url) {
    const resultado = await pool.query('INSERT INTO posts (user_id, conteudo, imagem_url) VALUES ($1, $2, $3) RETURNING id, user_id, conteudo, imagem_url, criado_em', [user_id, conteudo, imagem_url])
    const busca = resultado.rows[0];
    return busca;
}

async function listarFeed() {
    const resultado = await pool.query('SELECT posts.*, users.nome AS autor_nome FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.criado_em DESC');
    const busca = resultado.rows;
    return busca;
}

async function listarPorUsuario(user_id) {
    const resultado = await pool.query('SELECT posts.*, users.nome AS autor.nome FROM posts JOIN users ON posts.user_id = users.id WHERE posts.user_id = $1 ORDER BY posts.criado_em DESC', [user_id]);
    const busca = resultado.rows;
    return busca;
}

async function buscarPorId(id) {
    const resultado = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    const busca = resultado.rows[0];
    return busca;
}

async function deletarPost(id) {
    const resultado = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    const busca = resultado.rowCount;
    return busca;
}

module.exports = {criarPost, listarFeed, listarPorUsuario, buscarPorId, deletarPost};