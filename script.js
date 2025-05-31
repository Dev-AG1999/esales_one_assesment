require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./models/product'); // adjust the path as needed
const fs = require('fs');


const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

console.log('====================================');
console.log("line products",products);
console.log('====================================');
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB connected');



  // Insert the products
  await Product.insertMany(products);
  console.log('Products inserted successfully');
  process.exit();
})
.catch((err) => {
  console.error('Error inserting products:', err);
  process.exit(1);
});
