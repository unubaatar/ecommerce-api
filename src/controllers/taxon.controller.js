const Taxon = require("../models/taxon.model");

exports.create = async(req ,  res , next) => {
    try {
        const { name , ...body } = req.body;
        if(!name) {
            return res.status(404).json({ message: "Insert all fields" });
        }

        const newTaxon = new Taxon( { name , ...body});
        await newTaxon.save();
        return res.status(201).json({ message: "Created" , newTaxon });
    } catch(err) {
        next(err);
    }
}

exports.list = async(req ,  res , next) => {
    try {
        const taxons = await Taxon.find({});
        const totalCount = await Taxon.countDocuments({});
        return res.status(200).json({ rows: taxons , count: totalCount });
    } catch(err) {
        next(err);
    }
}

exports.update = async(req ,  res , next) => {
    try {
        const { _id  } = req.body;
        const updatedTaxon = await Taxon.findByIdAndUpdate(_id , req.body );
        return res.status(200).json({ message: "Updated successful" });
    } catch(err) {
        next(err);
    }
}

exports.getById = async(req ,  res , next) => {
    try {
        const { _id  } = req.body;
        const taxon = await Taxon.findById(_id );
        if(!taxon) {
            return res.status(404).json({ message: "Taxon not found" });
        }
        return res.status(200).json(taxon);
    } catch(err) {
        next(err);
    }
}