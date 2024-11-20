const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');


router.post('/create', orderController.createOrder);
router.post('/list', orderController.getOrders);
router.post('/:id', orderController.getOrderById);
router.post('/:id', orderController.updateOrder);
router.post('/:id', orderController.deleteOrder);

module.exports = router;
