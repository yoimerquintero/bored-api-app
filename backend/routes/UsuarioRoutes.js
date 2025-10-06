// routes/UsuarioRoutes.js
import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import { AutenticacionMiddleware } from '../middleware/AutenticacionMiddleware.js';

const router = Router();
const usuarioController = new UsuarioController();

// Registrar usuario
router.post('/registrar', (req, res) => usuarioController.registrar(req, res));

// Iniciar sesión
router.post('/iniciar-sesion', (req, res) => usuarioController.iniciarSesion(req, res));

// Verificar token
router.get('/verificar', AutenticacionMiddleware, (req, res) => usuarioController.verificarToken(req, res));

// Obtener perfil
router.get('/perfil', AutenticacionMiddleware, (req, res) => usuarioController.obtenerPerfil(req, res));

// Actualizar perfil
router.put('/perfil', AutenticacionMiddleware, (req, res) => usuarioController.actualizarPerfil(req, res));

export default router;
