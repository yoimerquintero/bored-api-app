const express = require('express');
const { FavoriteController } = require('../controllers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const favoriteController = new FavoriteController();

// Todas las rutas de favoritos requieren autenticación
router.get('/', authMiddleware, favoriteController.getFavorites);
router.post('/', authMiddleware, favoriteController.addFavorite);
router.post('/toggle', authMiddleware, favoriteController.toggleFavorite);
router.get('/check/:actividad_key', authMiddleware, favoriteController.checkFavorite);
router.get('/stats', authMiddleware, favoriteController.getFavoritesStats);
router.delete('/:actividad_key', authMiddleware, favoriteController.removeFavorite);

module.exports = router;