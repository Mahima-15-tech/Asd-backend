const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: {
    type: String,
    select: false // 🔥 IMPORTANT
  },

  // B2B fields
  companyName: String,
  gstNumber: String,
  importExportId: String,

  phone: String,
businessType: String,
plan: String,
expiryDate: Date,

  // Auth features
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,

  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role"
  },

  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan"
  },


  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },

  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DepartmentRole"
  },


  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);