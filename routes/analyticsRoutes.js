const express = require("express");
const router = express.Router();

const {
    getDashboard,
    shipmentOverTime,
    shipmentMode,
    topOrigins,
    topDestinations,
    spendByCategory,
    carrierPerformance,
    shipmentStatusOverview,
    transitTrend,
    getInsights
} = require("../controllers/analyticsController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");


// ==============================
// Dashboard
// ==============================

router.get(
    "/dashboard",
    protect,
    adminOnly,
    getDashboard
);


// ==============================
// Shipment Over Time
// ==============================

router.get(
    "/shipment-over-time",
    protect,
    adminOnly,
    shipmentOverTime
);


// ==============================
// Shipment Mode
// ==============================

router.get(
    "/shipment-mode",
    protect,
    adminOnly,
    shipmentMode
);


// ==============================
// Top Origins
// ==============================

router.get(
    "/top-origins",
    protect,
    adminOnly,
    topOrigins
);


// ==============================
// Top Destinations
// ==============================

router.get(
    "/top-destinations",
    protect,
    adminOnly,
    topDestinations
);


// ==============================
// Spend By Category
// ==============================

router.get(
    "/spend-category",
    protect,
    adminOnly,
    spendByCategory
);


// ==============================
// Carrier Performance
// ==============================

router.get(
    "/carrier-performance",
    protect,
    adminOnly,
    carrierPerformance
);


// ==============================
// Shipment Status Overview
// ==============================

router.get(
    "/status-overview",
    protect,
    adminOnly,
    shipmentStatusOverview
);


// ==============================
// Transit Trend
// ==============================

router.get(
    "/transit-trend",
    protect,
    adminOnly,
    transitTrend
);


// ==============================
// Insights
// ==============================

router.get(
    "/insights",
    protect,
    adminOnly,
    getInsights
);

module.exports = router;