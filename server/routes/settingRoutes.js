const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const auth = require('../middleware/auth');

// @route   GET /api/settings
router.get('/', auth, settingController.getSettings);

// @route   PUT /api/settings
router.put('/', auth, settingController.updateSettings);

// @route   POST /api/settings/reset
router.post('/reset', auth, settingController.resetSettings);

module.exports = router;
