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

    // update average rating (simple recalc)
    const approvedReviews = product.reviews.filter(r => r.approved);
    const totalRating = approvedReviews.reduce((s, r) => s + r.rating, 0);
    product.rating = approvedReviews.length ? (totalRating / approvedReviews.length) : product.rating;

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
