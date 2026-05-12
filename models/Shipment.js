const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({

  // 🔹 BASIC
  sbNumber: {
    type: String,
    unique: true
  },

  exporter: {
    companyName: String,
    iecNumber: String,
    contactPerson: String,
    mobile: String
  },

  // 🔹 CARGO
  cargo: {
    productName: String,
    hsCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HSCode"
    },
    weight: Number,
    quantity: Number,
    value: Number
  },

  // 🔹 ROUTE
  route: {
    origin: String,
    destination: String,
    carrier: String, // MSC, Maersk
    mode: {
      type: String,
      enum: ["Air", "Sea", "Road"]
    }
  },

  // 🔹 TIMELINE
  etd: Date,
  eta: Date,

  // 🔹 STATUS
  status: {
    type: String,
    enum: [
      "Draft",
      "In Transit",
      "Delivered",
      "Pending Docs",
      "Custom Hold"
    ],
    default: "Draft"
  },

  // 🔹 DOCS STATUS
  docsPending: {
    type: Boolean,
    default: true
  },

  // 🔹 REVENUE
  revenue: {
    type: Number,
    default: 0
  },

  // 🔹 STEP TRACKING
  currentStep: {
    type: Number,
    default: 1
  }

}, { timestamps: true });

module.exports = mongoose.model("Shipment", shipmentSchema);