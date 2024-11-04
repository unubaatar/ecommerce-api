const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taxonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
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

const Taxon = mongoose.model("Taxon" , taxonSchema);
module.exports = Taxon;