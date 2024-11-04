const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImage =
  "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg";

const productVariantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sellPrice: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      type: String,
      default: defaultImage,
    },
  ],
});

const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
module.exports = ProductVariant;
