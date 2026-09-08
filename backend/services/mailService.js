const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendOrderConfirmation = async (toEmail, order) => {
  try {
    if (!process.env.SMTP_USER) {
      console.warn('SMTP not configured - skipping email send');
      return;
    }

    const itemsHtml = order.items.map(it => `<li>${it.name} (${it.weight}) x ${it.qty} - ₹${it.price * it.qty}</li>`).join('');

    const html = `
      <h2>Thank you for your order - ${order.orderId}</h2>
      <p>Hi ${order.customerName},</p>
      <p>Your order has been placed successfully. Order summary:</p>
      <ul>${itemsHtml}</ul>
      <p>Total: <strong>₹${order.totalAmount}</strong></p>
      <p>We will notify you when the order status changes.</p>
      <p>Queens Masala</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toEmail,
      subject: `Order Confirmation - ${order.orderId}`,
      html
    });
  } catch (err) {
    console.error('Send order email error', err);
  }
};
