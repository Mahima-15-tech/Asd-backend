const MasterCategory = require("../models/MasterCategory");

// get categories
exports.getCategories = async (req, res) => {
  const data = await MasterCategory.find();
  res.json({ status: 1, data });
};

// create category
exports.createCategory = async (req, res) => {
  const { name, key, prefix } = req.body;

  const data = await MasterCategory.create({
    name,
    key,
    prefix
  });

  res.json({ status: 1, data });
};