const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  variants: [String],
  buttonText: String,
});

module.exports = mongoose.model('Product', productSchema);
