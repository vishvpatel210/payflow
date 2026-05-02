const Setting = require('../models/Setting');
const Activity = require('../models/Activity');

// @route   GET /api/settings
// @desc    Get all settings
// @access  Private
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne({ userId: req.user.id });
    if (!settings) {
      settings = new Setting({ userId: req.user.id });
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
    let settings = await Setting.findOne({ userId: req.user.id });
    if (!settings) {
      settings = new Setting({ ...req.body, userId: req.user.id });
    } else {
      // Deep merge or specific updates
      Object.assign(settings, req.body);
    }
    await settings.save();

    await Activity.create({
      userId: req.user.id,
      action: 'Settings Updated',
      description: 'Payroll system configuration was modified',
      status: 'Completed'
    });

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
    await Setting.deleteOne({ userId: req.user.id });
    const settings = new Setting({ userId: req.user.id });
    await settings.save();
    res.json(settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
