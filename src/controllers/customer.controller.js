const Customer = require("../models/customer.model");

exports.create = async (req, res, next) => {
  try {
    const { firstname, lastname, phone, email, password } = req.body;
    if (!firstname || !lastname || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCustomer = new Customer({ firstname, lastname, phone, email, password });
    await newCustomer.save();
    res.status(201).json({ message: "Customer created successfully", newCustomer });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { customerId, ...body } = req.body;
    const customer = await Customer.findByIdAndUpdate(customerId, body, { new: true });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ message: "Customer updated successfully", customer });
  } catch (err) {
    next(err);
  }
};


exports.changePassword = async (req, res, next) => {
  try {
    const { customerId, oldPassword, newPassword } = req.body;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.password !== oldPassword) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    customer.password = newPassword;
    await customer.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};
