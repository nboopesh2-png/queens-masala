const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/:id', auth, reviewController.addReview);
router.get('/:id', reviewController.getReviews);

module.exports = router;
