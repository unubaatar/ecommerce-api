const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultImage = "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg"

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: defaultImage
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand" , brandSchema);
module.exports = Brand;