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
const customerRoutes = require("./src/routes/customer.route");
const cartItemRoutes = require("./src/routes/cartItem.route");
const orderRoutes = require("./src/routes/order.route");

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
app.use("/api/customers", customerRoutes);
app.use("/api/cartItems", cartItemRoutes);
app.use("/api/orders", orderRoutes);

// app.use("/" , (req, res) => {
//   res.status(200).send(' <h1>Odkood hairtai</h1>');
// });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
