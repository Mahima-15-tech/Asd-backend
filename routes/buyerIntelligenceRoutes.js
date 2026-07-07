const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getTopBuyers,
    getTradeTrend,
    getCountries,
    getGrowthBuyers,
    getBuyerConcentration,
    getRecentShipments,
    getFilterOptions
} = require("../controllers/buyerIntelligenceController");

// Dashboard
router.get("/dashboard", getDashboard);

// Buyers
router.get("/top-buyers", getTopBuyers);
router.get("/growth-buyers", getGrowthBuyers);
router.get("/buyer-concentration", getBuyerConcentration);

// Charts
router.get("/trade-trend", getTradeTrend);
router.get("/countries", getCountries);

// Shipments
router.get("/recent-shipments", getRecentShipments);

// Filters
router.get("/filters", getFilterOptions);

module.exports = router;