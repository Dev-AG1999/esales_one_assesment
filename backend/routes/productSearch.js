const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.post('/search', async (req, res) => {
  try {
    const { product } = req.body;
    
    if (!product) {
      return res.status(400).json({ error: "Product field is required." });
    }

 const searchedProducts = await Product.find({
title : { $regex: product, $options: 'i' }
});

    res.status(200).json({ products: searchedProducts });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error while searching products." });
  }
});

module.exports = router;
