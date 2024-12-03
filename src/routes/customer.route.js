const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");

router.post("/create", customerController.create);
router.post("/login", customerController.login);
router.post("/list", customerController.list);
router.post("/getById", customerController.getById);
router.post("/update", customerController.update);
router.post("/changePassword", customerController.changePassword);

module.exports = router;
    