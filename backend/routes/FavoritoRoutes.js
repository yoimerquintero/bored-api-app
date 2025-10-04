import { Router } from 'express';
import FavoritoController from '../controllers/FavoritoController.js';
import { AutenticacionMiddleware } from '../middleware/AutenticacionMiddleware.js';

const router = Router();
const favoritoController = new FavoritoController();

router.get('/', AutenticacionMiddleware, (req, res) => favoritoController.getFavoritos(req, res));
router.post('/', AutenticacionMiddleware, (req, res) => favoritoController.addFavorito(req, res));
router.post('/alternar', AutenticacionMiddleware, (req, res) => favoritoController.toggleFavorito(req, res));
router.get('/verificar/:actividad_key', AutenticacionMiddleware, (req, res) => favoritoController.checkFavorito(req, res));
router.get('/estadisticas', AutenticacionMiddleware, (req, res) => favoritoController.getFavoritosStats(req, res));
router.delete('/:actividad_key', AutenticacionMiddleware, (req, res) => favoritoController.removeFavorito(req, res));

export default router;
