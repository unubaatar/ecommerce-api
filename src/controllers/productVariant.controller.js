const ProductVariant = require("../models/productVariant.model");

exports.create = async (req, res, next) => {
  try {
    const { name, price, ...body } = req.body;
    if (!name || !price) {
      return res.status(404).json({ message: "Бүх талбаруудыг оруулна уу" });
    }
    const productVariant = new ProductVariant(req.body);
    await productVariant.save();
    return res
      .status(201)
      .json({ message: "Амжилттай үүслээ", variant: productVariant });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;
    if (!_id) {
      return res.status(404).json({ message: "Бүх талбаруудыг оруулна уу" });
    }
    const productVariant = await ProductVariant.findById(_id);
    if (!productVariant) {
      return res.status(404).json({ message: "Вариант олдсонгүй" });
    }
    return res.status(200).json({ message: "Амжилттай шинэчлэгдлээ" });
  } catch (err) {
    next(err);
  }
};
