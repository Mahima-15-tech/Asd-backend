const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: [
      "Shipping Partner",
      "Freight Forwarder",   // ✅ add this
      "Custom Broker",
      "Warehouse Partner",   // ✅ add this
      "Logistics",
      "Other"
    ],
    default: "Shipping Partner"
  },

  location: {
    type: String
  },

  rating: {
    type: Number,
    default: 0
  },

  activeShipments: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Vendor", vendorSchema);