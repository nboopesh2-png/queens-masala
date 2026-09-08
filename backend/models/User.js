const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  house: String,
  street: String,
  area: String,
  city: String,
  district: String,
  state: String,
  pincode: String,
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  phone: String,
  addresses: [addressSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
