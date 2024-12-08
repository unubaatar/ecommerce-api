const User = require("../models/user.model");
const { logControllerError } = require("../services/logger");

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
    logControllerError(err);
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
    return res
      .status(200)
      .json({
        message: "Successful",
        user: user._id,
        token: token,
        avatar: user.avatar,
      });
  } catch (err) {
    logControllerError(err);
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id, ...body } = req.body;
    const user = await User.findByIdAndUpdate(_id, req.body);
    if (!user) {
      return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    }
    return res
      .status(200)
      .json({ message: "Хэрэглэгч амжилттай шинэчлэгдлээ" });
  } catch (err) {
    logControllerError(err);
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { _id, password, newPassword } = req.body;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    }
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      return res.status(404).json({ message: "Нууц үг таарахгүй байна." });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed successful" });
  } catch (err) {
    logControllerError(err);
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { per_page, page } = req.body;
    const users = await User.find({})
      .skip((page - 1) * per_page)
      .limit(per_page)
      .select("-password");
    const count = await User.countDocuments({});
    return res.status(200).json({ count: count, rows: users });
  } catch (err) {
    logControllerError(err);
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    }
    return res.status(200).json(user);
  } catch (err) {
    logControllerError(err);
    next(err);
  }
};
