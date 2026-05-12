const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/shipmentController");

// booking flow
router.post("/step1", ctrl.saveStep1);
router.put("/step2/:id", ctrl.saveStep2);
router.put("/step3/:id", ctrl.saveStep3);
router.post("/documents", ctrl.uploadDocs);

// listing
router.get("/", ctrl.getShipments);
router.get("/stats", ctrl.getStats);

// actions
router.put("/status/:id", ctrl.updateStatus);

module.exports = router;