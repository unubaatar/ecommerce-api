const express = require('express');
const router = express.Router();
const productVariantController = require("../controllers/productVariant.controller");

router.post("/create" , productVariantController.create);
router.post("/update" , productVariantController.update);
router.post("/list" , productVariantController.list);
router.post("/getById" , productVariantController.getById);

module.exports = router;