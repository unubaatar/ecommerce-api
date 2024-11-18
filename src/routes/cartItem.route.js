const express = require('express');
const router = express.Router();
const cartItemController = require("../controllers/cartItem.controller");

router.post("/create", cartItemController.create);
router.post("/list", cartItemController.list);
router.post("/update", cartItemController.update);
router.post("/getByCustomer", cartItemController.getByCustomerId);
router.post("/delete", cartItemController.delete);

module.exports = router;
