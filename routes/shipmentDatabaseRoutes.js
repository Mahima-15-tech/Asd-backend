const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getShipments,
    getFilterOptions,
    exportReport
} = require("../controllers/shipmentDatabaseController");

// Dashboard Cards
router.get("/dashboard", getDashboard);

// Shipment Table
router.get("/shipments", getShipments);

// Filters
router.get("/filters", getFilterOptions);

// Export Report
router.get("/export-report", exportReport);

module.exports = router;