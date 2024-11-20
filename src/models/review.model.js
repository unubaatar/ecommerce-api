const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, 
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  comment: { type: String, required: true, maxlength: 500 },
  reviewDate: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Review', reviewSchema);
