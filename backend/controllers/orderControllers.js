const Order = require('../models/order');
const { sendEmail } = require('../utils/mailer');

const generateOrderId = () => `ORD-${Math.floor(Math.random() * 1000000)}`;

exports.createOrder = async (req, res) => {
  const { product, customer, simulateCode } = req.body;
  const orderId = generateOrderId();

  let transactionStatus;
  if (simulateCode === "1") transactionStatus = "approved";
  else if (simulateCode === "2") transactionStatus = "declined";
  else transactionStatus = "gateway_error";

  const newOrder = new Order({
    orderId,
    product,
    customer,
    transactionStatus,
  });

  await newOrder.save();

  const emailBody = `
    <h2>Order ${transactionStatus === "approved" ? "Confirmation" : "Failed"}</h2>
    <p>Order ID: ${orderId}</p>
    <p>Status: ${transactionStatus}</p>
  `;

  await sendEmail({
    to: customer.email,
    subject: `Your Order - ${transactionStatus}`,
    html: emailBody,
  });

  res.status(200).json({ orderId });
};

exports.getOrder = async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
};
