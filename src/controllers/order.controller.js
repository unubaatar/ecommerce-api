const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const ProductVariant = require('../models/productVariant.model');
const generateOrderNumber = require('../generator/orderNumber');
const STATES_AND_DISTRICTS = require('../constants/states');



exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, orderStatus, address } = req.body;

    if (!customer || !items || items.length === 0 || !address) {
      return res.status(400).json({ message: 'Customer, items, and address are required.' });
    }

    const { state, district, street, note = "" } = address;

    if (!STATES_AND_DISTRICTS[state]) {
      return res.status(400).json({ message: 'Invalid state selected.' });
    }

    const stateInfo = STATES_AND_DISTRICTS[state];
    if (!stateInfo.districts[district]) {
      return res.status(400).json({ message: `Invalid district selected for state ${stateInfo.name}.` });
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const { product, variant, qty } = item;

      if (!product || !qty) {
        return res.status(400).json({ message: 'Each item must include product and qty.' });
      }

      let productDetails;
      try {
        productDetails = await Product.findById(product).exec();
      } catch (err) {
        return res.status(500).json({ message: `Error fetching product with ID ${product}` });
      }

      if (!productDetails) {
        return res.status(404).json({ message: `Product with ID ${product} not found.` });
      }

      let price, salePrice;

      if (variant) {
        let variantDetails;
        try {
          variantDetails = await ProductVariant.findById(variant).exec();
        } catch (err) {
          return res.status(500).json({ message: `Error fetching variant with ID ${variant}` });
        }

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
      address: {
        state,
        district,
        street,
        note,  // note can now be optional
      },
    });

    await newOrder.save();

    return res.status(201).json({ message: 'Order created successfully', newOrder });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, per_page = 10, customer } = req.body;
    const query = {};

    if (customer) {
      if (mongoose.Types.ObjectId.isValid(customer)) {
        query.customer = customer;
      } else {
        return res.status(400).json({ message: 'Invalid customer ID format' });
      }
    };
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
    const { items, totalAmount, orderStatus, address } = req.body;

    if (!items || items.length === 0 || !address) {
      return res.status(400).json({ message: 'Items and address are required.' });
    }

    const { state, district, note } = address;

    if (!STATES_AND_DISTRICTS[state]) {
      return res.status(400).json({ message: 'Invalid state selected.' });
    }

    const stateInfo = STATES_AND_DISTRICTS[state];
    if (!stateInfo.districts[district]) {
      return res.status(400).json({ message: `Invalid district selected for state ${stateInfo.name}.` });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        items,
        totalAmount,
        orderStatus,
        address: {
          state,
          district,
          note,
        },
      },
      { new: true, runValidators: true }
    )
      .populate('customer')
      .populate('items.product')
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

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('customer')
      .populate('items.product')
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

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customer')
      .populate('items.product')
      .populate({
        path: 'items.variant',
        options: { strictPopulate: false },
      });

    return res.status(200).json(orders);
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

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    next(err);
  }
};

