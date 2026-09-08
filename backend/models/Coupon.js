const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: Number,
  maxDiscountAmount: Number,
  minOrderValue: Number,
  expiresAt: Date,
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Coupon', couponSchema);
