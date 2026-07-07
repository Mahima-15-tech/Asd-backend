const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  type: {
    type: String,
    enum: [
      "AI_QUERY",
      "SHIPMENT_CREATED",
      "DOCUMENT_UPLOADED",
      "INCENTIVE_CHECKED",
      "FREIGHT_CALCULATED"
    ]
  },

  message: String,

  meta: {
    type: Object // extra data (optional)
  },

  shipmentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Shipment"
    }

}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);