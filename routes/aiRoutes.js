const router = require("express").Router();
const ctrl = require("../controllers/aiController");

router.post("/ask", ctrl.askAI);
router.get("/history", ctrl.getChats);

module.exports = router;