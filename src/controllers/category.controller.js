const Category = require("../models/category.model");

exports.create = async (req, res, next) => {
  try {
    const { name, ...body } = req.body;
    if (!name) {
      return res.status(404).json({ message: "Insert all fields" });
    }
    const newCategory = new Category(req.body);
    await newCategory.save();
    return res.status(201).json({ message: "Created", newCategory });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const query = isActive ? { isActive: isActive } : {};
    const totalCategories = await Category.find(query);
    const totalCount = await Category.countDocuments(query);
    return res.status(200).json({ rows: totalCategories, count: totalCount });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(_id, req.body);
    return res.status(200).json({ message: "Updated successful" });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const category = await Category.findById(_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.status(200).json(category);
  } catch (err) {
    next(err);
  }
};
