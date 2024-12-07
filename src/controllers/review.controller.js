const Review = require('../models/review.model');
const Product = require('../models/product.model');

exports.create = async (req, res, next) => {
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

exports.getByProduct = async (req, res, next) => {
  try {
    const { productId } = req.body;

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

exports.update = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(_id , req.body);   
    if(!updatedReview) {
      res.status(200).json({ message: 'Review not found' });
    }

    res.status(200).json({ message: 'Review updated successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { reviewId } = req.body;

    const review = await Review.findByIdAndDelete(reviewId).exec();
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
