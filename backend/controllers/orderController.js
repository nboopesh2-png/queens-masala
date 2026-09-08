const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

function generateOrderId() {
  return 'QM' + Date.now();
}

exports.createOrder = async (req, res) => {
  try {
    const { items, subtotal, deliveryCharge = 0, discount = 0, totalAmount, paymentMethod, shippingAddress } = req.body;
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
      paymentStatus: paymentMethod === 'RAZORPAY' ? 'PENDING' : 'PENDING',
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

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product').lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    // authorization: owner or admin
    if (order.customer.toString() !== req.userId) {
      const user = await User.findById(req.userId);
      if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const orders = await Order.find().sort({ createdAt: -1 }).populate('customer').lean();
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.orderStatus = status;
    order.updatedAt = Date.now();
    await order.save();
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
