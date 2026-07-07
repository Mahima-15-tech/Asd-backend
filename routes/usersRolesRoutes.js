const express = require("express");

const router = express.Router();

const {

getDashboard,
getUsers,
getRoles,
getRoleDistribution,
inviteUser,
updateUser,
deleteUser,
changeStatus,
getActivity,
getFilterOptions,
searchUsers

} = require("../controllers/usersRolesController");


// Dashboard
router.get("/dashboard", getDashboard);

// Users
router.get("/users", getUsers);

router.get("/search", searchUsers);

router.post("/invite", inviteUser);

router.put("/:id", updateUser);

router.patch("/status/:id", changeStatus);

router.delete("/:id", deleteUser);

// Roles
router.get("/roles", getRoles);

router.get("/role-distribution", getRoleDistribution);

// Activity
router.get("/activity", getActivity);

// Filters
router.get("/filter-options", getFilterOptions);

module.exports = router;