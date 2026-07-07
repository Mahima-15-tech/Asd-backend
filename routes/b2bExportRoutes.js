const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getExportTrend,
    getTopProducts,
    getTopExporters,
    getTopBuyers,
    getCountryDistribution,
    getPortWiseExports,
    getRecentShipments,
    getFilterOptions
} = require("../controllers/b2bExportController");

// Dashboard
router.get("/dashboard", getDashboard);

// Filters
router.get("/filters", getFilterOptions);

// Charts
router.get("/export-trend", getExportTrend);
router.get("/country-distribution", getCountryDistribution);

// Tables
router.get("/top-products", getTopProducts);
router.get("/top-exporters", getTopExporters);
router.get("/top-buyers", getTopBuyers);
router.get("/port-wise-exports", getPortWiseExports);
router.get("/recent-shipments", getRecentShipments);

module.exports = router;