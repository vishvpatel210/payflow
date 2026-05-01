const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityController');
const auth = require('../middleware/auth');

// @route   GET /api/activities
// @desc    Get chronological list of activities
// @access  Private
router.get('/', auth, getActivities);

module.exports = router;
