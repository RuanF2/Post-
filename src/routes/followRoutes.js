const followController = require('../controllers/followController');
const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');

router.post('/:following_id', verificarToken, followController.toggleFollow);
router.get('/:user_id/seguidores', followController.listarSeguidores);
router.get('/:user_id/seguindo', followController.listarSeguindo);

module.exports = router;