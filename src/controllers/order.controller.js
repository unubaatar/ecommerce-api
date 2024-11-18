const mongoose = require('mongoose');

const Order = require('../models/order.model');
const Product = require('../models/product.model');
const ProductVariant = require('../models/productVariant.model');


const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const time = date.getTime().toString().slice(-5);
  const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${year}${month}${day}-${time}${randomString}`;
};

exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, orderStatus } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ message: 'Customer and items are required.' });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const { product, variant, qty } = item;

      if (!product || !qty) {
        return res.status(400).json({ message: 'Each item must include product and qty.' });
      }

      const productDetails = await Product.findById(product).exec();
      if (!productDetails) {
        return res.status(404).json({ message: `Product with ID ${product} not found.` });
      }

      let price, salePrice;

      if (variant) {
        const variantDetails = await ProductVariant.findById(variant).exec();
        if (!variantDetails) {
          return res.status(404).json({ message: `Variant with ID ${variant} not found.` });
        }
        price = variantDetails.price;
        salePrice = variantDetails.sellPrice || price;
      } else {
        price = productDetails.price;
        salePrice = productDetails.sellPrice || price;
      }

      const itemTotal = salePrice * qty;
      totalAmount += itemTotal;

      processedItems.push({
        product,
        variant,
        qty,
        price,
        salePrice,
      });
    }

    const orderNumber = generateOrderNumber();

    const newOrder = new Order({
      customer,
      items: processedItems,
      totalAmount,
      orderStatus,
      orderNumber,
    });

    await newOrder.save();

    return res.status(201).json({ message: 'Order created successfully', newOrder });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, per_page = 10, customer } = req.query;
    const query = {};

    if (customer) {
      if (mongoose.Types.ObjectId.isValid(customer)) {
        query.customer = customer;
      } else {
        return res.status(400).json({ message: 'Invalid customer ID format' });
      }
    }

    const skip = (page - 1) * per_page;
    const limit = Number(per_page);

    const orders = await Order.find(query)
      .populate('customer')
      .populate('items.product')
      .populate({
        path: 'items.variant',
        options: { strictPopulate: false },
      })
      .skip(skip)
      .limit(limit);

    const totalCount = await Order.countDocuments(query);

    return res.status(200).json({ rows: orders, count: totalCount });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('customer')
      .populate({
        path: 'items.product',
      })
      .populate({
        path: 'items.variant',
        options: { strictPopulate: false },
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { items, totalAmount, orderStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { items, totalAmount, orderStatus },
      { new: true, runValidators: true }
    )
      .populate('customer')
      .populate({
        path: 'items.product',
      })
      .populate({
        path: 'items.variant',
        options: { strictPopulate: false },
      });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order updated successfully', updatedOrder });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
  } catch (err) {
    next(err);
  }
};
