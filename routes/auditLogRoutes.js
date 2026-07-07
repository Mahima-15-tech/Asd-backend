const express = require("express");
const router = express.Router();

const {
  getAuditLogs,
  getAuditLogDetails,
  getAuditDashboard,
  activitiesByModule,
  activityTimeline,
  deleteAuditLog,
  clearAuditLogs,
  getFilterOptions
} = require("../controllers/auditLogController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");


// =======================================
// Dashboard
// =======================================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getAuditDashboard
);



// =======================================
// Pie Chart
// =======================================

router.get(
  "/analytics/modules",
  protect,
  adminOnly,
  activitiesByModule
);


// =======================================
// Line Chart
// =======================================

router.get(
  "/analytics/timeline",
  protect,
  adminOnly,
  activityTimeline
);

// =======================================
// Filter Options
// =======================================

router.get(
  "/filter-options",
  protect,
  adminOnly,
  getFilterOptions
);


// =======================================
// Audit Logs List
// =======================================

router.get(
  "/",
  protect,
  adminOnly,
  getAuditLogs
);


// =======================================
// Activity Details
// =======================================

router.get(
  "/:id",
  protect,
  adminOnly,
  getAuditLogDetails
);






// =======================================
// Delete One Log
// =======================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteAuditLog
);



// =======================================
// Clear All Logs
// =======================================

router.delete(
  "/clear/all",
  protect,
  adminOnly,
  clearAuditLogs
);

module.exports = router;