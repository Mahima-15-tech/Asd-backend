const mongoose = require("mongoose");

const shipmentTrackingSchema = new mongoose.Schema({

    shipmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shipment",
        required: true
    },

    status: {
        type: String,
        enum: [
            "Shipment Planned",
            "Dispatched",
            "Arrival at Origin Airport",
            "Transit Custom Clearance",
            "In Transit",
            "Arrival at Destination Airport",
            "Import Customs Clearance",
            "Out For Delivery",
            "Delivered"
        ],
        required: true
    },

    location: {
        type: String
    },

    city: String,

    country: String,

    latitude: Number,

    longitude: Number,

    remarks: String,

    current: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("ShipmentTracking", shipmentTrackingSchema);