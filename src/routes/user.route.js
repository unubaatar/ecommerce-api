const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/create" , userController.create);
router.post("/login" , userController.login);
router.post("/update" , userController.update);
router.post("/changePassword" , userController.changePassword);
router.post("/list" , userController.list);
router.post("/getById" , userController.getById);

module.exports = router;