const express = require("express");
const router = express.Router();

const {
    getDashboard,
    getHSCodeList,
    getTradeFlow,
    getTopProducts,
    getCountries,
    getImporters,
    getExporters,
    getTrends,
    getHSCodeDetails,
    getFilterOptions
} = require("../controllers/hsCodeIntelligenceController");

// Dashboard
router.get("/dashboard", getDashboard);

// HS Code Analytics
router.get("/hscode-list", getHSCodeList);
router.get("/hscode-details", getHSCodeDetails);

// Charts
router.get("/trade-flow", getTradeFlow);
router.get("/trends", getTrends);
router.get("/countries", getCountries);

// Products & Companies
router.get("/top-products", getTopProducts);
router.get("/importers", getImporters);
router.get("/exporters", getExporters);

// Filters
router.get("/filters", getFilterOptions);

module.exports = router;