const mongoose = require('mongoose');
const STATES_AND_DISTRICTS = require('../constants/states');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  address: {
    state: { type: Number, required: true, enum: Object.keys(STATES_AND_DISTRICTS).map(Number) },
    district: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          const stateInfo = STATES_AND_DISTRICTS[this.address.state];
          return stateInfo && stateInfo.districts[value];
        },
        message: (props) => `${props.value} is not a valid district for the selected state.`,
      },
    },
    note: { type: String },
  },
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
