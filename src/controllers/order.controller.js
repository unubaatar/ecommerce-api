const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const CartItem = require('../models/cartItem.model');
const ProductVariant = require('../models/productVariant.model');
const generateOrderNumber = require('../generator/orderNumber');
const STATES_AND_DISTRICTS = require('../constants/states');



exports.create = async (req, res, next) => {
  try {
    const { customer, items, orderStatus, address } = req.body;

    if (!customer || !items || items.length === 0 || !address) {
      return res.status(400).json({ message: 'Customer, items, and address are required.' });
    }

    const { state, district, street, note = "" } = address;


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
        note,  
      },
    });

    await newOrder.save();
    const cartItemsToDelete = await CartItem.deleteMany({ customer: customer });
    return res.status(201).json( newOrder);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
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

exports.getById = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const order = await Order.findById(_id)
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

exports.update = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate( _id, req.body);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getByCustomer = async (req, res, next) => {
  try {
    const { customer } = req.body;
    const orders = await Order.find( { customer: customer } )
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

