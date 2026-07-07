const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateProfile,
    uploadProfileImage,
    changePassword,
    getPreferences,
    updatePreferences,
    getLoginSessions,
    getAccountActivities,
    getProfileCompletion
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

// ================= PROFILE =================

router.get("/", protect, getProfile);

router.put("/", protect, updateProfile);

router.post("/image", protect, uploadProfileImage);

router.put("/password", protect, changePassword);

// ================= PREFERENCES =================

router.get("/preferences", protect, getPreferences);

router.put("/preferences", protect, updatePreferences);

// ================= LOGIN SESSIONS =================

router.get("/sessions", protect, getLoginSessions);

// ================= ACCOUNT ACTIVITY =================

router.get("/activity", protect, getAccountActivities);

// ================= PROFILE COMPLETION =================

router.get("/completion", protect, getProfileCompletion);

module.exports = router;