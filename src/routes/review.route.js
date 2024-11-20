const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');

router.post('/create', reviewController.createReview);
router.post('/:productId', reviewController.getReviewsByProduct);
router.post('/:reviewId', reviewController.updateReview);
router.post('/:reviewId', reviewController.deleteReview);

module.exports = router;
