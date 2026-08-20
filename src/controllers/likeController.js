const likeModel = require('../models/likeModel');

async function toggleLike(req, res) {
    try{
        const {post_id} = req.params;
        const user_id = req.user_id;
        const like = await likeModel.verificarLike(user_id, post_id);

       if(like){
            await likeModel.removerLike(user_id, post_id);
            res.status(200).json({mensagem: 'Like removido', curtiu: 'false'});
            return;
       }else{
            await likeModel.darLike(user_id, post_id);
            res.status(200).json({mensagem: 'Like adicionado', curtiu: 'true'});
            return;
       }
        }catch(erro){
        res.status(400).json({mensagem: 'Erro ao dar like'});
    }
}