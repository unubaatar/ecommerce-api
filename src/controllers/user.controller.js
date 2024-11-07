const User = require("../models/user.model");

exports.create = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(404).json({ message: "Insert all fields" });
    }
    const foundEmail = await User.findOne({ email: email });
    if (foundEmail) {
      return res.status(404).json({ message: "Email duplicated" });
    }
    const foundPhoneNumber = await User.findOne({ phone: phone });
    if (foundPhoneNumber) {
      return res.status(404).json({ message: "Phone duplicated" });
    }
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
    });
    await user.save();
    return res.status(201).json({ message: "User created", user: user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(404).json({ message: "Insert all fields" });
    }
    const user = userName.includes("@")
      ? await User.findOne({ email: userName })
      : await User.findOne({ phone: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).json({ message: "Password incorrect" });
    }
    const token = user.getUserToken();
    const _id = user._id;
    return res
      .status(200)
      .json({ message: "Successful", user: _id, token: token });
  } catch (err) {
    next(err);
  }
};
