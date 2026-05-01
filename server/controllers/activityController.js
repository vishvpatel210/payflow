const Activity = require('../models/Activity');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate('employeeId', 'name avatar role department')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(activities);
  } catch (err) {
    console.error('getActivities error:', err.message);
    res.status(500).json({ msg: 'Server error while fetching activities' });
  }
};
