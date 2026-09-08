const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const auth = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', auth, createProduct); // admin-protected in controller

module.exports = router;
