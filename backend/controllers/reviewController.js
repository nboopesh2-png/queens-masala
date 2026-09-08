const Product = require('../models/Product');

exports.addReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;
    const userId = req.userId;
    if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existing = product.reviews.find(r => r.user && r.user.toString() === userId);
    if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

    const review = { user: userId, name: req.body.name || 'Anonymous', rating, comment, approved: false };
    product.reviews.push(review);

    await product.save();

    res.status(201).json({ message: 'Review submitted for approval' });
  } catch (err) {
    console.error('Add review error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).select('reviews').lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const approved = product.reviews.filter(r => r.approved);
    res.json({ reviews: approved });
  } catch (err) {
    console.error('Get reviews error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// admin: approve or delete specific review
exports.approveReview = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.approved = true;
    await product.save();
    res.json({ message: 'Review approved' });
  } catch (err) {
    console.error('Approve review error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const user = await require('../models/User').findById(req.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { productId, reviewId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    review.remove();
    await product.save();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Delete review error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
