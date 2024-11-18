const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      variant: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
      qty: { type: Number, required: true },
      price: { type: Number, required: true },
      salePrice: { type: Number },
    },
  ],
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
