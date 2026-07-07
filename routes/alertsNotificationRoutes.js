const express = require("express");

const router = express.Router();

const {

getDashboard,
getAlerts,
getNotifications,
getAlertFilters,
getNotificationFilters,
markNotificationRead,
markAllNotificationsRead,
resolveAlert,
deleteAlert,
deleteNotification

} = require("../controllers/alertsNotificationController");


// Dashboard
router.get("/dashboard", getDashboard);


// Alerts
router.get("/alerts", getAlerts);

router.get("/alerts/filter-options", getAlertFilters);

router.patch("/alerts/resolve/:id", resolveAlert);

router.delete("/alerts/:id", deleteAlert);


// Notifications
router.get("/notifications", getNotifications);

router.get("/notifications/filter-options", getNotificationFilters);

router.patch("/notifications/read/:id", markNotificationRead);

router.patch("/notifications/read-all", markAllNotificationsRead);

router.delete("/notifications/:id", deleteNotification);

module.exports = router;