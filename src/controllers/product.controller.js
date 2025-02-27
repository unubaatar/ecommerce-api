const Product = require("../models/product.model");
const { logControllerError } = require("../services/logger");

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
    logControllerError(err);
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
      .populate("category brand variants")
      .skip((page - 1) * per_page)
      .limit(per_page)
      .sort({ createdAt: sortOrder, price: sortByPrice });

    const totalCount = await Product.countDocuments(query);

    return res.status(200).json({ rows: items, count: totalCount });
  } catch (err) {
    logControllerError(err);
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const { filter } = req.body;
    let query = {};
    if (filter && filter.category) {
      if (filter.category.length > 0) {
        query.category = { $in: filter.category };
      }
    }

    if (filter && filter.search) {
      query.name = { $regex: filter.search, $options: "i" };
    }
    const items = await Product.find(query)
      .populate("category brand")
      .sort({ createdAt: -1 });
    const totalCount = await Product.countDocuments(query);

    return res.status(200).json({ rows: items, count: totalCount });
  } catch (err) {
    logControllerError(err);
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
    logControllerError(err);
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
    logControllerError(err);
    next(err);
  }
};

exports.getSimiliarProducts = async (req, res, next) => {
  try {
    const { productId } = req.body;
    console.log(req.body);
    const foundProduct = await Product.findOne({ _id: productId });
    const products = await Product.find({
      category: foundProduct.category.toString(),
      _id: { $ne: productId },
    })
    .populate("category brand")
      .limit(4)
      .sort({ createdAt: -1 });

      return res.status(200).json(products);
    
  } catch (err) {
    console.log(err);
  }
};
