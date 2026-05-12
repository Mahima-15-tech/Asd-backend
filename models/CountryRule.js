const mongoose = require("mongoose");

const countryRuleSchema = new mongoose.Schema({

  // 🔹 Basic
  ruleName: { type: String, required: true },
  ruleCode: String,
  ruleType: { type: String, required: true },

  // 🔹 Country
  sourceCountry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country"
  },
  destinationCountry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country"
  },
  region: String,
  tradeZone: String,

  // 🔹 Tax
  taxRules: {
    customsDuty: Number,
    importTax: Number,
    exportTax: Number,
    vatGst: Number,
    currency: String,
    penalty: Number,
    formula: String
  },

  // 🔹 Compliance
  compliance: {
    documents: [String],
    customsApproval: Boolean,
    licenseRequired: Boolean,
    restrictedCategories: [String],
    notes: String,
    files: [String]
  },

  // 🔹 AI
  aiData: {
    riskScore: Number,
    fraudProbability: Number,
    alerts: Number,
    recommendation: String
  },

  // 🔹 Automation
  automation: {
    condition: String,
    shipmentType: String,
    vendorSpecific: Boolean,
    smartValidation: Boolean,
    triggerNotification: Boolean
  },

  importRestrictions: String,

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  // 🔹 Link with HS Code
  hsCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HSCode"
  }

}, { timestamps: true });

module.exports = mongoose.model("CountryRule", countryRuleSchema);