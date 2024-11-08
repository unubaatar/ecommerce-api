const ProductVariant = require("../models/productVariant.model");
const Product =  require("../models/product.model");

exports.create = async (req, res, next) => {
  try {
    const {  productId,  name, price, ...body  } = req.body;
    if (!name || !price) {
      return res.status(404).json({ message: "Бүх талбаруудыг оруулна уу" });
    }
    const productVariant = new ProductVariant(req.body);
    await productVariant.save();
    const product = await Product.findById(productId);
    if(!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.variants.push(productVariant);
    await product.save();
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
    const productVariant = await ProductVariant.findByIdAndUpdate(_id , req.body);
    if (!productVariant) {
      return res.status(404).json({ message: "Вариант олдсонгүй" });
    }
    return res.status(200).json({ message: "Амжилттай шинэчлэгдлээ" });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { _id } = req.body;
    query = {
      _id: _id,
    };
    const productVariants = await ProductVariant.find({ query });
    const productVariantCount = await ProductVariant.countDocuments({ query });
    res.status(200).json({ rows: productVariants, count: productVariantCount });
  } catch (err) {
    next(err);
  }
};

exports.getById = async(req , res , next) => {
  try {
    const { _id } = req.body;
    const variant = await ProductVariant.findById(_id);
    if(!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }
    return res.status(200).json(variant);
  } catch(err) {
    console.log(err);
  }
}
