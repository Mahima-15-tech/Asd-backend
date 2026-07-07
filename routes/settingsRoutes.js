const express = require("express");

const router = express.Router();

const {

getSettings,
updateGeneral,
updatePreferences,
updateNotifications,
updateSecurity,
updateBilling,
updateTheme,
changePassword,
getActivity,
getAccountSummary

} = require("../controllers/settingsController");


// Settings
router.get("/", getSettings);

// General
router.put("/general", updateGeneral);

// Preferences
router.put("/preferences", updatePreferences);

// Notifications
router.put("/notifications", updateNotifications);

// Security
router.put("/security", updateSecurity);

// Billing
router.put("/billing", updateBilling);

// Theme
router.put("/theme", updateTheme);

// Change Password
router.put("/change-password", changePassword);

// Recent Activity
router.get("/activity", getActivity);

// Account Summary
router.get("/account-summary", getAccountSummary);

module.exports = router;