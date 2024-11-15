const express = require('express');
const router = express.Router();
const productController = require("../controllers/product.controller");

router.post("/create" , productController.create);
router.post("/list" , productController.list);
router.post("/update" , productController.update);
router.post("/getById" , productController.getById);
router.post("/getAll" , productController.getAll);

module.exports = router;