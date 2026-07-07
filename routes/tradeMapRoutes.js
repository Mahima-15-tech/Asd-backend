const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getTradeFlow,
    getTopRoutes,
    getTopCountries,
    getRegionAnalysis,
    getSummary,
    getCountryOverview,
    getFilterOptions
} = require("../controllers/tradeMapController");

// Dashboard
router.get("/dashboard", getDashboard);

// Map
router.get("/trade-flow", getTradeFlow);

// Trade Routes
router.get("/top-routes", getTopRoutes);
router.get("/country-overview", getCountryOverview);

// Analytics
router.get("/top-countries", getTopCountries);
router.get("/region-analysis", getRegionAnalysis);
router.get("/summary", getSummary);

// Filters
router.get("/filters", getFilterOptions);

module.exports = router;