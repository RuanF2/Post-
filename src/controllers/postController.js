const postModel = require('../models/postModel');

async function criarPost(req, res) {
    try{
        const {conteudo, imagem_url} = req.body;
        const userId = req.user_id;

        const novoPost = await postModel.criarPost(userId, conteudo, imagem_url);
        res.status(201).json(novoPost);
    }catch(erro){
        res.status(500).json({ mensagem: 'Erro ao criar post' });
    }
}

async function listarFeed(req, res) {
    try{
        const posts = await postModel.listarFeed();
        res.status(200).json(posts);
    }catch(erro){
        res.status(500).json({mensagem:'Erro ao realizar postagem'});
    }
}

async function listarPorUsuario(req, res) {
    try{
        const {user_id} = req.params;
        const posts = await postModel.listarPorUsuario(user_id);
        res.status(200).json(posts);

    }catch(erro){
        res.status(500).json({mensagem: 'Erro ao fazer listagem'});
    }
}

async function buscarPorId(req, res) {
    try{
        const {id} = req.params;
        const buscar = await postModel.buscarPorId(id);

        if(!buscar){
            res.status(404).json({mensagem: 'Post não encontrado'});
            return;
        }

        res.status(200).json(buscar);

    }catch(erro){
        res.status(500).json({mensagem: 'Erro ao buscar post'});
    }
}

async function deletarPost(req, res) {
    try{
        const {id} = req.params;
        const post = await postModel.buscarPorId(id);
        if(!post){
            res.status(404).json({mensagem: 'O post não existe'});
            return;
        }
        if(post.user_id !== req.user_id){
            res.status(403).json({mensagem: 'Usuário sem autorização para deletar'});
            return;
        }
        await postModel.deletarPost(id);
        res.status(200).json({mensagem: 'Post deletado com sucesso'});
        

    }catch(erro){
        res.status(500).json({mensagem: 'Erro ao deletar post'});
    }
}

module.exports = { criarPost, listarFeed, listarPorUsuario, buscarPorId, deletarPost };