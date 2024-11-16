const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    salePrice: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);
module.exports = CartItem;
