const { UserService } = require('../services');

const userService = new UserService();

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Acceso denegado. No hay token proporcionado.' 
      });
    }

    const decoded = userService.verifyToken(token);
    const userResult = await userService.getUserById(decoded.id);

    if (!userResult.success) {
      return res.status(401).json({ 
        success: false,
        error: 'Token inválido.' 
      });
    }

    req.user = userResult.data;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: 'Token inválido.' 
    });
  }
};

// Middleware para rutas opcionales (si el token existe, lo usa, pero no es requerido)
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = userService.verifyToken(token);
      const userResult = await userService.getUserById(decoded.id);
      
      if (userResult.success) {
        req.user = userResult.data;
      }
    }

    next();
  } catch (error) {
    // Si hay error con el token, continuamos sin usuario
    next();
  }
};

module.exports = { authMiddleware, optionalAuthMiddleware };