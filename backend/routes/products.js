const express = require('express');
const router = express.Router();
const Product = require('../models/product'); 


router.get('/', async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({ products: products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
