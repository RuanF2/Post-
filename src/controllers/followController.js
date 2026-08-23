const followModel = require('../models/followModel');

async function toggleFollow(req, res){
    try{
        const {following_id} = req.params;
        const follower_id = req.user_id;

         if(follower_id == following_id){
            res.status(400).json({mensagem: 'Não é possível seguir seu perfil'});
            return;
        }

        const verificar = await followModel.verificarSeguindo(follower_id, following_id);
        
        if(verificar){
            await followModel.deixarDeSeguir(follower_id, following_id)
            res.status(200).json({mensagem: 'Deixou de seguir', seguir: 'false'});
            return;
        }else{
            await followModel.seguir(follower_id, following_id)
            res.status(200).json({mensagem: 'Começou a seguir', seguir: 'true'});
            return;
        }

    }catch(erro){
        res.status(404).json({mensagem: 'Conta não encontrada'});
    }
}

async function listarSeguidores(req, res) {
    try{
        const {user_id} = req.params;
        const listar = await followModel.listarSeguidores(user_id);
        res.status(200).json(listar);

    }catch(erro){
        res.status(400).json({mensagem: 'Listagem mal sucedida'});
    }
}

async function listarSeguindo(req, res) {
    try{
        const {user_id} = req.params;
        const listar = await followModel.listarSeguindo(user_id);
        res.status(200).json(listar);

    }catch(erro){
        res.status(400).json({mensagem: 'Listagem mal sucedida'});
    }
}

module.exports = {toggleFollow, listarSeguidores, listarSeguindo};