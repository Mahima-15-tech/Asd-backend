const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/vendorController");

router.post("/", ctrl.createVendor);
router.get("/", ctrl.getVendors);
router.get("/:id", ctrl.getVendor);
router.put("/:id", ctrl.updateVendor);
router.delete("/:id", ctrl.deleteVendor);

// optional
router.get("/stats/all", ctrl.getVendorStats);

module.exports = router;