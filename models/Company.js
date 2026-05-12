const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  company: String,
  subtitle: String,

  type: {
    type: String,
    enum: ["buyer", "seller"]
  },

  verified: {
    type: Boolean,
    default: false
  },

  location: {
    city: String,
    state: String,
    country: String
  },

  product: String,

  tradeFrequency: {
    type: String,
    enum: ["high", "medium", "low"]
  },

  tradeVolume: Number,

  orders: Number,

  lastActivity: Date

}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);