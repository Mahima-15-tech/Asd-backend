const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  companyName: String,

  location: {
    country: String,
    state: String,
    city: String
  },

  product: String,

  tradeVolume: Number, // USD

  orders: Number,

  lastTrade: Date,

  verified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Buyer", buyerSchema);