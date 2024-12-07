const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const CartItem = require("../models/cartItem.model");
const Customer = require("../models/customer.model");
const ProductVariant = require("../models/productVariant.model");
const generateOrderNumber = require("../generator/orderNumber");
const STATES_AND_DISTRICTS = require("../constants/states");

exports.create = async (req, res, next) => {
  try {
    const { customer, items, orderStatus, address } = req.body;

    if (!customer || !items || items.length === 0 || !address) {
      return res
        .status(400)
        .json({ message: "Customer, items, and address are required." });
    }

    const { state, district, street, note = "" } = address;

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const { product, variant, qty } = item;

      if (!product || !qty) {
        return res
          .status(400)
          .json({ message: "Each item must include product and qty." });
      }

      let productDetails;
      try {
        productDetails = await Product.findById(product).exec();
      } catch (err) {
        return res
          .status(500)
          .json({ message: `Error fetching product with ID ${product}` });
      }

      if (!productDetails) {
        return res
          .status(404)
          .json({ message: `Product with ID ${product} not found.` });
      }

      let price, salePrice;

      if (variant) {
        let variantDetails;
        try {
          variantDetails = await ProductVariant.findById(variant).exec();
        } catch (err) {
          return res
            .status(500)
            .json({ message: `Error fetching variant with ID ${variant}` });
        }

        if (!variantDetails) {
          return res
            .status(404)
            .json({ message: `Variant with ID ${variant} not found.` });
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
    return res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
};
// Захиалгуудын мэдээллийг авах функц
exports.list = async (req, res, next) => {
  try {
    // Хүсэлтийн body хэсгээс тухайн барааны filter болон хуудсны тоог авах
    const { page = 1, per_page = 10 , filter } = req.body;
    const query = {};
    // Хэрэв тухайн орж ирсэн filter-т phone орж ирвэл тухайн хэрэглэгчийг утасны дугаараар нь хайн query-дээ оруулж өгнө. 
    if(filter && filter.phone) {
      const customer = await Customer.find({ phone: filter.phone }).select("_id"); // Зөвхөн ID-г сонгож авна. 
      query.customer = { $in: customer }  // $in нь тухайн хэрэглэгчийн id-г агуулахаар query рүү оруулж өгнө. 
    };
  // Хэрэв тухайн орж ирсэн filter-т orderNumber орж ирвэл захиалгын дугаарыг query-д оруулж өгнө. 
    if(filter && filter.orderNumber) {
      query.orderNumber = filter.orderNumber;
    };
    // Хэрэв тухайн орж ирсэн filter-т orderStatus орж ирвэл захиалгын төлөвөөр query-д оруулж өгнө. 
    if(filter.orderStatus) {
      query.orderStatus = { $in: filter.orderStatus }
    };
    // Өгөгдлийн тоог countDocument ашиглан авна. 
    const count = await Order.countDocuments({});
    //Тухайн орж ирсэн шүүлтээр дээр тулгуурлан өгөгдлүүдийг хайна. Ингэхдээ find() функц ашиглана. 
    const orders = await Order.find(query)
      .skip((page - 1) * per_page) // skip ашиглан хэр их хэмжээний өгөгдөл алгасхыг зааж өгнө. Энэ нь pagination хийхэд ашиглагдаж байгаа. 
      .limit(per_page) // нэг хуудсанд орох өгөгдлийн тоог зааж өгсөн. 
      .populate("items.product") // populate ашиглан item.product-г задлана. Populate нь mongoose-ийг Id - гаар шүүн дэлгэрэнгүй мэдээлэл авдаг функц
      .populate("items.variant") 
      .populate("customer")
      .sort({ createdAt: -1 }); // sort ашиглан үүссэн хугацаагаар нь буурах эрэмбээр эрэмбэлнэ. 
    return res.status(200).json({ rows: orders, count: count }); // orders болон count - г json хэлбэрээр буцаана. 
  } catch (err) {
    next(err);
  }
};

// Захиалгыг Id-р нь хайх функц
exports.getById = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const order = await Order.findById(_id)
      .populate("customer")
      .populate({
        path: "items.product",
      })
      .populate({
        path: "items.variant",
        options: { strictPopulate: false },
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// Захиалгыг шинэчлэх функц
exports.update = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(_id, req.body);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order updated successfully" });
  } catch (err) {
    next(err);
  }
};

// Захиалгуудыг хэрэглэгчээр нь авах функц
exports.getByCustomer = async (req, res, next) => {
  try {
    const { customer } = req.body;
    const orders = await Order.find({ customer: customer })
      .populate("customer")
      .populate("items.product")
      .populate({
        path: "items.variant",
        // items.variant байхгүй үед populate хийх шаардлагагүйг зааж өгсөн. 
        options: { strictPopulate: false }, 
      });

    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// Захиалга устгах функц (Шаардлагатай үед ашиглана.)
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    // findByIdAndDelete нь Order model-с id-р нь хайн устгадаг
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    next(err);
  }
};
