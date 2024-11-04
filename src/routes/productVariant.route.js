const express = require('express');
const router = express.Router();
const productVariantController = require("../controllers/productVariant.controller");

router.post("/create" , productVariantController.create);
router.post("/update" , productVariantController.update);

module.exports = router;