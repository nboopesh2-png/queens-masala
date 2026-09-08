const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.get('/users', auth, adminController.getUsers);
router.put('/users/:id/toggle', auth, adminController.toggleUser);

module.exports = router;
