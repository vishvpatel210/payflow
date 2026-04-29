const Setting = require('../models/Setting');

// @route   GET /api/settings
// @desc    Get all settings
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /api/settings
// @desc    Update settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      // Deep merge or specific updates
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /api/settings/reset
// @desc    Reset settings to default
// @access  Private
exports.resetSettings = async (req, res) => {
  try {
    await Setting.deleteMany({});
    const settings = new Setting();
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
