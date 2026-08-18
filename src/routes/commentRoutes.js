const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/post/:post_id', verificarToken, commentController.criarComentario);
router.get('/post/:post_id', commentController.listarPorPost);
router.delete('/:id', verificarToken, commentController.deletarComentario);

module.exports = router;