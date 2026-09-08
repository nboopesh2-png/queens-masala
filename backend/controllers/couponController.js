const Coupon = require('../models/Coupon');

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
