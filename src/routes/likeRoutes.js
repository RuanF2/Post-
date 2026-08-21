const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/post/:post_id', verificarToken, likeController.toggleLike);
router.get('/post/:post_id/contagem', likeController.contarLikes);

module.exports = router;