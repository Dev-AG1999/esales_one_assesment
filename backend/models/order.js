const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: String,
  product: Object,
  customer: Object,
  transactionStatus: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
