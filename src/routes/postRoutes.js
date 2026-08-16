const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/', verificarToken, postController.criarPost );
router.get('/feed', postController.listarFeed);
router.get('/usuario/:user_id',postController.listarPorUsuario);
router.get('/:id', postController.buscarPorId);
router.delete('/:id', verificarToken, postController.deletarPost);

module.exports = router;