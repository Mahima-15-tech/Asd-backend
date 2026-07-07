const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(

  {
    // Report Owner
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Report Details
    reportName: {
      type: String,
      required: true
    },

    description: String,

    category: {
      type: String,
      enum: [
        "Shipment Reports",
        "Cost & Finance Reports",
        "Vendor Reports",
        "Compliance Reports",
        "Document Reports",
        "Performance Reports",
        "Analytics & Trends"
      ]
    },

    dataSource: {
      type: String
    },

    // Which module generated this report
    module: {
      type: String,
      enum: [
        "Dashboard",
        "Shipment",
        "Shipment Tracking",
        "HS Lookup",
        "Incentive Checker",
        "Freight Calculator",
        "Vendor Recommendation",
        "Documents Center",
        "Analytics"
      ]
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId
    },

    reportData: {
      type: mongoose.Schema.Types.Mixed
    },

    // Sharing
    sharedWith: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isShared: {
      type: Boolean,
      default: false
    },

    // Favourite
    isFavourite: {
      type: Boolean,
      default: false
    },

    // Schedule
    frequency: {
      type: String,
      enum: [
        "None",
        "Daily",
        "Weekly",
        "Monthly"
      ],
      default: "None"
    },

    // Stats
    totalViews: {
      type: Number,
      default: 0
    },

    totalDownloads: {
      type: Number,
      default: 0
    },

    lastViewed: Date,

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Archived"
      ],
      default: "Active"
    },

    type: {
      type: String,
      enum: [
        "Summary",
        "Operational",
        "Analytics",
        "Financial",
        "Compliance",
        "Performance"
      ]
    },
    
    format: {
      type: String,
      enum: ["PDF", "Excel", "CSV"],
      default: "PDF"
    },
    
    fileUrl: String,

  },

  
  {
    timestamps: true
  }

);

module.exports = mongoose.model("Report", reportSchema);