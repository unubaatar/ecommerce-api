const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.post('/create', reviewController.create);
router.post('/getByProduct', reviewController.getByProduct);
router.post('/update', reviewController.update);
router.post('/delete', reviewController.delete);

module.exports = router;
