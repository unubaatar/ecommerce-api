const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Product", default: [] }],
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
