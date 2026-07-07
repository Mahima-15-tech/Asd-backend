const express = require("express");
const router = express.Router();

const shipmentController = require("../controllers/shipmentController");
const { protect } = require("../middleware/authMiddleware");

// Existing APIs
router.post("/step1", protect, shipmentController.saveStep1);
router.put("/step2/:id", protect, shipmentController.saveStep2);
router.put("/step3/:id", protect, shipmentController.saveStep3);
router.post("/upload-docs", protect, shipmentController.uploadDocs);
router.get("/", protect, shipmentController.getShipments);
router.get("/stats", protect, shipmentController.getStats);
router.put("/:id/status", protect, shipmentController.updateStatus);

// ✅ New API
router.get("/:id/details", protect, shipmentController.getShipmentDetails);

module.exports = router;