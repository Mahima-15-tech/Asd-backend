const router = require("express").Router();
const ctrl = require("../controllers/moduleController");
const upload = require("../utils/fileUpload");

router.post("/create", ctrl.createModule);
// stats
router.get("/stats", ctrl.getStats);

// installed
router.get("/installed", ctrl.getInstalledModules);

// marketplace
router.get("/marketplace", ctrl.getMarketplaceModules);

// install
router.post("/install", ctrl.installModule);

// toggle
router.put("/toggle/:id", ctrl.toggleModule);

// delete
router.delete("/:id", ctrl.deleteModule);

// config
router.put("/config/:id", ctrl.updateConfig);

// upload zip
router.post("/upload", upload.single("file"), ctrl.uploadModule);

module.exports = router;