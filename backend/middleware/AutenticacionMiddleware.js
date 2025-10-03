// middleware/AutenticacionMiddleware.js
import { UsuarioService } from '../services/index.js';

const usuarioService = new UsuarioService();

// Middleware obligatorio (requiere token válido)
const AutenticacionMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Acceso denegado. No se proporcionó un token.'
      });
    }

    const decodificado = usuarioService.verificarToken(token);
    const usuarioResult = await usuarioService.obtenerUsuarioPorId(decodificado.id);

    if (!usuarioResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido.'
      });
    }

    req.usuario = usuarioResult.data;
    next();
  } catch (error) {
    console.error('❌ Error en AutenticacionMiddleware:', error);
    res.status(401).json({
      success: false,
      error: 'Token inválido o expirado.'
    });
  }
};

// Middleware opcional (si hay token válido, lo usa, si no, continúa sin usuario)
const AutenticacionOpcionalMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decodificado = usuarioService.verificarToken(token);
      const usuarioResult = await usuarioService.obtenerUsuarioPorId(decodificado.id);

      if (usuarioResult.success) {
        req.usuario = usuarioResult.data;
      }
    }

    next();
  } catch (error) {
    // Si el token es inválido, seguimos sin usuario
    next();
  }
};

// ✅ Exportamos con nombres
export { AutenticacionMiddleware, AutenticacionOpcionalMiddleware };
