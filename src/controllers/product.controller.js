const Product = require("../models/product.model");

exports.create = async (req, res, next) => {
  try {
    const { name, price, category, ...body } = req.body;
    if (!name || !price || !category) {
      return res.status(404).json({ message: "Insert all fields" });
    }

    const newProduct = new Product({
      name,
      price,
      category,
      ...body,
    });

    await newProduct.save();
    return res.status(201).json({ message: "Created new product", newProduct });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const {
      filter,
      page = 1,
      per_page = 10,
      dateFilter,
      priceFilter,
    } = req.body;

    let query = {};

    if (filter && filter.searchField) {
      query.name = { $regex: filter.searchField, $options: "i" };
    }

    const sortOrder = dateFilter === "getFirst" ? 1 : -1;
    const sortByPrice = priceFilter === "asc" ? 1 : -1;

    const items = await Product.find(query)
      .populate("category brand")
      .skip((page - 1) * per_page)
      .limit(per_page)
      .sort({ createdAt: sortOrder, price: sortByPrice });

    const totalCount = await Product.countDocuments(query);

    return res.status(200).json({ rows: items, count: totalCount });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let query = {};
    const items = await Product.find(query).populate("category brand");
    const totalCount = await Product.countDocuments(query);

    return res.status(200).json({ rows: items, count: totalCount });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;
    console.log(_id);
    const product = await Product.findByIdAndUpdate(_id, req.body);
    if (product) {
      return res.status(200).json({ message: "Updated successful", product });
    }
    return res.status(200).json({ message: "Product not found" });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;
    const product = await Product.findById(_id).populate(
      "category brand variants"
    );
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};
