const router = require("express").Router();
const ctrl = require("../controllers/adController");

// CRUD
router.post("/", ctrl.createAd);
router.get("/", ctrl.getAds);
router.put("/:id", ctrl.updateAd);
router.delete("/:id", ctrl.deleteAd);

// extra actions
router.post("/duplicate/:id", ctrl.duplicateAd);
router.post("/status/:id", ctrl.changeStatus);
router.post("/priority", ctrl.updatePriority);

// preview
router.get("/preview/:id", ctrl.getAdPreview);

// stats + analytics
router.get("/stats", ctrl.getStats);
router.get("/performance", ctrl.getPerformance);
router.get("/analytics", ctrl.getAnalytics);

module.exports = router;