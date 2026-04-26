const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
