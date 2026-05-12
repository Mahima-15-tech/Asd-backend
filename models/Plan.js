// models/Plan.js

const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: String,

  planType: {
    type: String,
    enum: ["monthly", "yearly"]
  },

  price: Number,

  billingCycle: String, // per month / per year

  description: String,

  features: [
    {
      name: String,
      enabled: Boolean
    }
  ],

  limits: {
    shipmentLimit: Number,
    userLimit: Number,
    apiLimit: Number,
    storageLimit: Number
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  isPopular: Boolean,
  isRecommended: Boolean

}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);