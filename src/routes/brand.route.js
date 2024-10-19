const express = require('express');
const router = express.Router();
const brandController = require("../controllers/brand.controller");

router.post("/create" , brandController.create);
router.post("/list" , brandController.list);
router.post("/update" , brandController.update);

module.exports = router;