const express = require('express');
const router = express.Router();
const categoryController = require("../controllers/category.controller");

router.post("/create" , categoryController.create);
router.post("/list" , categoryController.list);
router.post("/update" , categoryController.update);
router.post("/getById" , categoryController.getById);

module.exports = router;
