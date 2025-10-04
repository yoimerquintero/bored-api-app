import { Router } from 'express';
import ActividadController from '../controllers/ActividadController.js';

const router = Router();
const actividadController = new ActividadController();

router.get('/aleatoria', (req, res) => actividadController.getRandomActividad(req, res));
router.get('/tipos', (req, res) => actividadController.getTipos(req, res));
router.get('/buscar', (req, res) => actividadController.searchActividades(req, res));
router.get('/:clave', (req, res) => actividadController.getActividadByKey(req, res));
router.get('/', (req, res) => actividadController.getAll(req, res));

export default router;
