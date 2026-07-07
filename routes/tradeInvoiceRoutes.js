const express = require("express");
const router = express.Router();

const {

getDashboard,
getInvoices,
getStatusSummary,
getValueTrend,
getRecentInvoices,
getTopParties,
getOverdueInvoices,
getInsights,
getFilterOptions

} = require("../controllers/tradeInvoiceController");

router.get("/dashboard", getDashboard);

router.get("/", getInvoices);

router.get("/status-summary", getStatusSummary);

router.get("/value-trend", getValueTrend);

router.get("/recent", getRecentInvoices);

router.get("/top-parties", getTopParties);

router.get("/overdue", getOverdueInvoices);

router.get("/insights", getInsights);

router.get("/filter-options", getFilterOptions);

module.exports = router;