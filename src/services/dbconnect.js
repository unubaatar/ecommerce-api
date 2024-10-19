const mongoose = require("mongoose");

const dotenv = require("dotenv");
process.env;
dotenv.config({ path: ".env" });

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDb;
