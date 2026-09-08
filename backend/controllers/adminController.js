const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const users = await User.find().select('-password').lean();
    res.json({ users });
  } catch (err) {
    console.error('Get users error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleUser = async (req, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.disabled = !user.disabled;
    await user.save();
    res.json({ user });
  } catch (err) {
    console.error('Toggle user error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
