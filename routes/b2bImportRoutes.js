const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getImportTrend,
    getTopProducts,
    getTopSuppliers,
    getTopImporters,
    getCountryDistribution,
    getPortWiseImports,
    getRecentShipments,
    getFilterOptions
} = require("../controllers/b2bImportController");

// Dashboard
router.get("/dashboard", getDashboard);

// Filters
router.get("/filters", getFilterOptions);

// Charts
router.get("/import-trend", getImportTrend);
router.get("/country-distribution", getCountryDistribution);

// Tables
router.get("/top-products", getTopProducts);
router.get("/top-suppliers", getTopSuppliers);
router.get("/top-importers", getTopImporters);
router.get("/port-wise-imports", getPortWiseImports);
router.get("/recent-shipments", getRecentShipments);

module.exports = router;