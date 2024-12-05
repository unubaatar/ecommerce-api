const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');


router.post('/create', orderController.create);
router.post('/list', orderController.list);
router.post('/getById', orderController.getById);
router.post('/update', orderController.update);
router.post("/getByCustomer" , orderController.getByCustomer);
router.post('/delete', orderController.deleteOrder);

module.exports = router;
