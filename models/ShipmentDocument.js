const mongoose = require("mongoose");

const shipmentDocumentSchema = new mongoose.Schema({

  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shipment"
  },

  name: String, // Invoice, Packing List
  fileUrl: String,

  required: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("ShipmentDocument", shipmentDocumentSchema);