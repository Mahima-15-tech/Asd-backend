const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getTopCountries,
    getSupplierTypes,
    getQualityDistribution,
    getTopSuppliers,
    getSupplierSpotlight,
    getRecentShipments,
    getFilterOptions
} = require("../controllers/supplierDiscoveryController");

// Dashboard
router.get("/dashboard", getDashboard);

// Analytics
router.get("/top-countries", getTopCountries);
router.get("/supplier-types", getSupplierTypes);
router.get("/quality-distribution", getQualityDistribution);

// Suppliers
router.get("/top-suppliers", getTopSuppliers);
router.get("/supplier-spotlight", getSupplierSpotlight);

// Shipments
router.get("/recent-shipments", getRecentShipments);

// Filters
router.get("/filters", getFilterOptions);

module.exports = router;