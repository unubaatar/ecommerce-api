const express = require('express');
const router = express.Router();
const taxonController = require("../controllers/taxon.controller");

router.post("/create" , taxonController.create);
router.post("/list" , taxonController.list);
router.post("/update" , taxonController.update);
router.post("/getById" , taxonController.getById);

module.exports = router;
