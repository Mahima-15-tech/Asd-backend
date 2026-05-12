// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const user = require("../controllers/usercontroller");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, user.createUser); 
router.get("/", protect, adminOnly, user.getUsers);
router.delete("/:id", protect, adminOnly, user.deleteUser);
router.put("/:id", protect, adminOnly, user.updateUser);
router.put("/toggle/:id", protect, adminOnly, user.toggleStatus);
router.get("/:id", protect, adminOnly, user.getUserById);
router.put("/reset-password/:id", protect, adminOnly, user.resetUserPassword);

router.post("/invite/:id", protect, adminOnly, user.sendInvite);

module.exports = router;