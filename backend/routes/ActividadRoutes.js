import { Router } from 'express';
import ActividadController from '../controllers/ActividadController.js';

const router = Router();
const actividadController = new ActividadController();

// Ruta para actividad aleatoria
router.get('/aleatoria', (req, res) => actividadController.getRandomActividad(req, res));

// Ruta para borrar todas las actividades (SOLO DESARROLLO)
router.delete('/reset', (req, res) => actividadController.deleteAllActividades(req, res));

// Ruta para obtener tipos de actividades
router.get('/tipos', (req, res) => actividadController.getTipos(req, res));

// Ruta para buscar actividades
router.get('/buscar', (req, res) => actividadController.searchActividades(req, res));

// Ruta para obtener actividades con filtros
router.get('/filtros', (req, res) => actividadController.getActividadesByFilters(req, res));

// Ruta para obtener actividades por tipo
router.get('/tipo/:tipo', (req, res) => actividadController.getActividadesByType(req, res));

// Ruta para obtener actividad por clave
router.get('/:clave', (req, res) => actividadController.getActividadByKey(req, res));

// Ruta para obtener todas las actividades o con límite
router.get('/', (req, res) => {
  if (req.query.limit) {
    actividadController.getActividadesWithLimit(req, res);
  } else {
    actividadController.getAll(req, res);
  }
});

export default router;