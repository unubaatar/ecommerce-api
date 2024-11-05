const Brand = require("../models/brand.model");

exports.create = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    if(!name) {
        return res.status(400).json({ message: "Insert all fields" });
    }
    const newBrand = new Brand({ name, image });
    await newBrand.save();
    return res.status(201).json({ message: "Created successful" });
  } catch (err) {
    next(err);
  }
};

exports.list = async(req , res , next) => {
    try {
        const { isActive } = req.body;
        const query = isActive ? { isActive: isActive } : {};
        const brands = await Brand.find(query);
        const count = await Brand.countDocuments(query);
        return res.status(200).json({ rows: brands , count: count });
    } catch(err) {
        next(err);
    }
}

exports.update = async(req , res , next) => {
    try {
        const { _id , ...body } = req.body;
        const updatedBrand = await Brand.findByIdAndUpdate(_id , req.body);
        if(!updatedBrand) {
            return res.status(400).json({ message: "Brand not found" });
        }
        return res.status(200).json({ message: "Updated Successful" });
    } catch(err) {
        next(err);
    }
}

