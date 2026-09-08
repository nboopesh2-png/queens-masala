const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: Number,
  comment: String,
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  ingredients: String,
  usage: String,
  storage: String,
  shelfLife: String,
  weights: [String],
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  mrp: Number,
  price: Number,
  discountPercentage: Number,
  stock: { type: Number, default: 100 },
  rating: { type: Number, default: 4.5 },
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
