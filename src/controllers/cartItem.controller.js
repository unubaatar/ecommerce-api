const CartItem = require("../models/cartItem.model");

exports.create = async (req, res, next) => {
  try {
    const { product, variant, qty, salePrice, price, customer, ...body } = req.body;

    if (!product || !qty || !customer || !price) {
      return res.status(400).json({ message: "Insert all fields" });
    }

    const newCartItem = new CartItem({
      product,
      variant,
      qty,
      salePrice,
      price,
      customer,
      ...body,
    });

    await newCartItem.save();
    return res.status(201).json({ message: "Cart item created successfully", newCartItem });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page = 1, per_page = 10, customer } = req.body;

    let query = {};
    if (customer) {
      query.customer = customer;
    }

    const cartItems = await CartItem.find(query)
      .populate("product variant customer")
      .skip((page - 1) * per_page)
      .limit(per_page);

    const totalCount = await CartItem.countDocuments(query);

    return res.status(200).json({ rows: cartItems, count: totalCount });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const cartItems = await CartItem.find().populate("product variant customer");
    const totalCount = await CartItem.countDocuments();

    return res.status(200).json({ rows: cartItems, count: totalCount });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;

    const updatedCartItem = await CartItem.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({ message: "Cart item updated successfully", updatedCartItem });
  } catch (err) {
    next(err);
  }
};

exports.getByCustomerId = async (req, res, next) => {
  try {
    const { customer } = req.params;

    const cartItems = await CartItem.find({ customer }).populate("product variant");
    if (cartItems.length === 0) {
      return res.status(404).json({ message: "No cart items found for this customer" });
    }

    return res.status(200).json(cartItems);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCartItem = await CartItem.findByIdAndDelete(id);
    if (!deletedCartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({ message: "Cart item deleted successfully", deletedCartItem });
  } catch (err) {
    next(err);
  }
};
