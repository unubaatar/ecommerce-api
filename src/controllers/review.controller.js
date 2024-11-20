const Review = require('../models/review.model');
const Product = require('../models/product.model');

// Create a new review
exports.createReview = async (req, res, next) => {
  try {
    const { product, customer, rating, comment } = req.body;

    if (!product || !customer || !rating || !comment) {
      return res.status(400).json({ message: 'Product, customer, rating, and comment are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const productExists = await Product.findById(product).exec();
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const review = new Review({ product, customer, rating, comment });
    await review.save();

    res.status(201).json({ message: 'Review added successfully.', review });
  } catch (err) {
    next(err);
  }
};

exports.getReviewsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const productExists = await Product.findById(productId).exec();
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const reviews = await Review.find({ product: productId }).populate('customer', 'firstname lastname').exec();

    res.status(200).json({ message: 'Reviews fetched successfully.', reviews });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId).exec();
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
      }
      review.rating = rating;
    }

    if (comment) {
      review.comment = comment;
    }

    await review.save();

    res.status(200).json({ message: 'Review updated successfully.', review });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId).exec();
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
