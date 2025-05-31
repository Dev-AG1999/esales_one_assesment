const express = require('express');
const router = express.Router();
const { createOrder, getOrder } = require('../controllers/orderControllers');

router.post('/', createOrder);
router.get('/:orderId', getOrder);

module.exports = router;
