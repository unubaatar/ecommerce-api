const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImage =
  "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    thumbnails: [
      {
        type: String,
        default: defaultImage,
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    sellPrice: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    taxon: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Taxon",
    },
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant"
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
