const express = require('express');
const { ActivityController } = require('../controllers');
const { optionalAuthMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const activityController = new ActivityController();

// Rutas públicas
router.get('/random', activityController.getRandomActivity);
router.get('/types', activityController.getActivityTypes);
router.get('/search', activityController.searchActivities);

// Rutas con parámetros
router.get('/:key', activityController.getActivityByKey);

// Rutas con filtros (query parameters)
router.get('/', activityController.getActivitiesByFilters);

module.exports = router;