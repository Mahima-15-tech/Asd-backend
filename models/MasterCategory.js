// models/MasterCategory.js

const mongoose = require("mongoose");

const masterCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  key: {
    type: String,
    required: true,
    unique: true
    // e.g. product_category, shipment_type
  },

  prefix: {
    type: String,
    required: true
    // e.g. PRO, SHIP, CON
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("MasterCategory", masterCategorySchema);