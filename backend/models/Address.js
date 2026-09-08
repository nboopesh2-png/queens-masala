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

module.exports = mongoose.model('Address', addressSchema);
