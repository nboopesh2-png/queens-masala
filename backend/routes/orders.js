const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);

// admin routes
router.get('/admin/all', auth, orderController.getAllOrders);
router.put('/admin/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;
