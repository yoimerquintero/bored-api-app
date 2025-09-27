const express = require('express');
const { UserController } = require('../controllers');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const userController = new UserController();

// Rutas públicas (sin autenticación)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas protegidas (requieren autenticación)
router.get('/verify', authMiddleware, userController.verifyToken);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

module.exports = router;