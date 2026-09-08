const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// public
router.post('/:id', auth, reviewController.addReview);
router.get('/:id', reviewController.getReviews);

// admin
router.put('/admin/:productId/:reviewId/approve', auth, reviewController.approveReview);
router.delete('/admin/:productId/:reviewId', auth, reviewController.deleteReview);

module.exports = router;
