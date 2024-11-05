// express set up
const express = require("express");
const cors = require('cors');
const connectDb = require('./src/services/dbconnect');

// env configuration 
const dotenv = require("dotenv");
process.env;
dotenv.config({ path: ".env" });

//selected routes
const userRoutes = require("./src/routes/user.route");
const productRoutes = require("./src/routes/product.route");
const categoryRoutes = require("./src/routes/category.route");
const brandRoutes = require("./src/routes/brand.route");
const productVariantRoutes = require("./src/routes/productVariant.route");

// use server and conenct mongodb 
const app = express();
app.use(cors());
app.use(express.json());
connectDb();

// routes
app.use("/api/users" , userRoutes);
app.use("/api/products" , productRoutes);
app.use("/api/categories" , categoryRoutes);
app.use("/api/brands" , brandRoutes);
app.use("/api/productVariants" , productVariantRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
