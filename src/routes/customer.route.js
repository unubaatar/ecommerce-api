const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

router.post("/create", customerController.create);
router.get("/list", customerController.list);
router.get("/:customerId", customerController.getById);
router.put("/update", customerController.update);
router.put("/changePassword", customerController.changePassword);

module.exports = router;
