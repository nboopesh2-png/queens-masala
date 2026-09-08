const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { code, discountPercentage, maxDiscountAmount, minOrderValue, expiresAt, enabled } = req.body;
    const coupon = new Coupon({ code: code.toUpperCase(), discountPercentage, maxDiscountAmount, minOrderValue, expiresAt, enabled });
    await coupon.save();
    res.status(201).json({ coupon });
  } catch (err) {
    console.error('Create coupon error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json({ coupons });
  } catch (err) {
    console.error('Get coupons error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    Object.assign(coupon, req.body);
    if (req.body.code) coupon.code = req.body.code.toUpperCase();
    await coupon.save();
    res.json({ coupon });
  } catch (err) {
    console.error('Update coupon error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    await coupon.remove();
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    console.error('Delete coupon error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// validation function already exists in earlier file but maintain here for export compatibility
exports.validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code is required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), enabled: true });
    if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid coupon' });

    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ valid: false, message: 'Coupon expired' });
    if (coupon.minOrderValue && orderValue < coupon.minOrderValue) return res.status(400).json({ valid: false, message: 'Order value too low for coupon' });

    const discount = Math.min((coupon.discountPercentage / 100) * orderValue, coupon.maxDiscountAmount || Infinity);

    res.json({ valid: true, discount: Math.round(discount), coupon: { code: coupon.code, discountPercentage: coupon.discountPercentage } });
  } catch (err) {
    console.error('Coupon validate error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
