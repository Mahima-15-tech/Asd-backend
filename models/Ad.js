const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({

  title: { type: String, required: true },

  type: {
    type: String,
    enum: ["banner", "video", "popup"],
    default: "banner"
  },

  placement: {
    type: String,
    enum: ["dashboard", "homepage", "sidebar"],
    required: true
  },

  image: String,

  redirectUrl: String,

  clickBehavior: {
    type: String,
    enum: ["same_tab", "new_tab"],
    default: "same_tab"
  },

  startDate: Date,
  endDate: Date,

  priority: {
    type: Number,
    default: 1
  },

  status: {
    type: String,
    enum: ["active", "paused", "inactive", "draft"],
    default: "draft"
  },

  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("Ad", adSchema);