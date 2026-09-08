const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    const options = {
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    res.json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay createOrder error', err);
    res.status(500).json({ message: 'Payment gateway error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return res.json({ valid: true });
    }
    return res.status(400).json({ valid: false, message: 'Invalid signature' });
  } catch (err) {
    console.error('Razorpay verify error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
