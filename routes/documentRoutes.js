const express = require("express");
const router = express.Router();

const documentController = require("../controllers/documentController");
const upload = require("../middleware/upload");

const { protect } = require("../middleware/authMiddleware");

// Dashboard
router.get(
    "/dashboard",
    protect,
    documentController.getDashboard
);

// All Documents
router.get(
    "/",
    protect,
    documentController.getDocuments
);

// Recent Uploads
router.get(
    "/recent",
    protect,
    documentController.getRecentUploads
);

// Storage
router.get(
    "/storage",
    protect,
    documentController.getStorage
);

// Expiring Documents
router.get(
    "/expiring",
    protect,
    documentController.getExpiringDocuments
);

// Upload
router.post(
    "/upload",
    protect,
    upload.single("file"),
    documentController.uploadDocument
);

// Download
router.get(
    "/:id/download",
    protect,
    documentController.downloadDocument
);

// Delete
router.delete(
    "/:id",
    protect,
    documentController.deleteDocument
);

module.exports = router;