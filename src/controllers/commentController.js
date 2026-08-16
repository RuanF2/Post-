const commentModel = require('../models/commentModel');

async function criarComentario(req, res) {
    try{
        const {conteudo} = req.body;
        const {post_id} = req.params
        const user_id = req.user_id;
        const novoComentario = await commentModel.criarComentario(post_id, user_id, conteudo)

        res.status(201).json(novoComentario);
    }catch(erro){
        res.status(400).json({mensagem: 'Erro ao criar comentário'})
    }
}

async function listarPorPost(req, res) {
    try{
        const {post_id} = req.params;
        const listarPost = await commentModel.listarPorPost(post_id)
        res.status(200).json(listarPost);
    }catch(erro){
        res.status(404).json({mensagem: 'Post não encontrado'});
    }
}

async function deletarComentario(req, res) {
    try{
        const {id} = req.params
        const buscarComentario = await commentModel.buscarPorId(id);
        if(!buscarComentario){
            res.status(404).json({mensagem: 'Comentario não encontrado'});
            return;

        }
        if(buscarComentario.user_id !== req.user_id){
            res.status(403).json({mensagem: 'Você não possuí altorização para deletar este comentário'});
            return;

        }
        const deletar = await commentModel.deletarComentario(id);
        res.status(200).json({mensagem: 'Comentário deletado'});
    }catch(erro){
        res.status(500).json({mensagem: 'Erro ao deletar comentário'})
    }
}

module.exports = {criarComentario, listarPorPost, deletarComentario};