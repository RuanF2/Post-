const pool = require('../config/database');

async function criarMensagem(conversation_id, remetente_id, conteudo) {
    const resultado = await pool.query ('INSERT INTO messages (conversation_id, remetente_id, conteudo) VALUES($1, $2, $3) RETURNING id, conversation_id, remetente_id, conteudo, criado_em', [conversation_id, remetente_id, conteudo]);
    const busca = resultado.rows[0];
    return busca;
};

async function listarMensagensDaConversa(conversation_id) {
    const resultado = await pool.query('SELECT * FROM messages WHERE conversation_id = $1 ORDER BY criado_em ASC', [conversation_id]);
    const busca = resultado.rows;
    return busca;
};

async function marcarComoLida(conversation_id, remetente_id) {
    const resultado = await pool.query('UPDATE messages SET lida = true WHERE conversation_id = $1 AND remetente_id != $2', [conversation_id, remetente_id]);
    const busca = resultado.rowCount;
    return busca;
};

module.exports = {criarMensagem, listarMensagensDaConversa, marcarComoLida};