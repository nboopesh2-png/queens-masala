const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const auth = require('../middleware/auth');

// public validate
router.post('/validate', couponController.validateCoupon);

// admin CRUD
router.post('/', auth, couponController.createCoupon);
router.get('/', auth, couponController.getCoupons);
router.put('/:id', auth, couponController.updateCoupon);
router.delete('/:id', auth, couponController.deleteCoupon);

module.exports = router;
