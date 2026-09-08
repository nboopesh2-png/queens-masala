const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

function generateOrderId() {
  return 'QM' + Date.now();
}

exports.createOrder = async (req, res) => {
  try {
    const { items, subtotal, deliveryCharge = 0, discount = 0, totalAmount, paymentMethod, shippingAddress, paymentResult } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // basic items validation
    const orderItems = [];
    for (let it of items) {
      const prod = await Product.findById(it.product);
      if (!prod) return res.status(400).json({ message: 'Invalid product in cart' });
      orderItems.push({ product: prod._id, name: prod.name, image: prod.images?.[0], weight: it.weight, qty: it.qty, price: it.price });
    }

    const order = new Order({
      orderId: generateOrderId(),
      customer: user._id,
      customerName: user.name,
      phone: shippingAddress.phone || user.phone,
      email: user.email,
      items: orderItems,
      subtotal,
      deliveryCharge,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus: (paymentMethod === 'RAZORPAY' && paymentResult && paymentResult.razorpay_payment_id) ? 'PAID' : 'PENDING',
      paymentResult: paymentResult || null,
      shippingAddress,
      orderStatus: 'ORDER PLACED'
    });

    await order.save();

    res.status(201).json({ order });
  } catch (err) {
    console.error('Create order error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
