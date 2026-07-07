const express = require("express");
const router = express.Router();

const {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  getVendorStats,
  getVendorDashboard,
  getVendorComparison,
  getVendorInsights,
  getRecommendedVendors
} = require("../controllers/vendorController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createVendor);

router.get("/", protect, getVendors);

router.get("/dashboard", protect, getVendorDashboard);

router.get("/stats/all", protect, getVendorStats);

router.get("/comparison", protect, getVendorComparison);

router.get("/insights", protect, getVendorInsights);

router.get("/recommendation/:shipmentId", protect, getRecommendedVendors);

router.get("/:id", protect, getVendorById);

router.put("/:id", protect, updateVendor);

router.delete("/:id", protect, deleteVendor);

module.exports = router;