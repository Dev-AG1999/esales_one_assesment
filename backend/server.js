require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const orderRoutes = require('./routes/orderRoutes');
const productSearchRouter = require('./routes/productSearch');
const productRoutes = require('./routes/products');



const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('eCommerce Checkout Backend is running 🚀');
});
app.use('/api/orders', orderRoutes);
app.use('/api', productSearchRouter);
app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server running on http://localhost:5000"));
  })
  .catch(err => console.error(err));

