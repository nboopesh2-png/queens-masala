const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  image: String,
  weight: String,
  qty: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  phone: String,
  email: String,
  items: [orderItemSchema],
  subtotal: Number,
  deliveryCharge: Number,
  discount: Number,
  totalAmount: Number,
  paymentMethod: String,
  paymentStatus: { type: String, default: 'PENDING' },
  shippingAddress: Object,
  orderStatus: { type: String, default: 'ORDER PLACED' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
