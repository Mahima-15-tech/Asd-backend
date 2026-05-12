const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).populate("roleId");

  req.user = {
    ...user.toObject(),
    role: user.roleId.name // 🔥 ensure role always present
  };

  next();
};

exports.adminOnly = (req, res, next) => {
  console.log("ROLE:", req.user.role); // 🔥

  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only access" });
  }
  next();
};

exports.checkPermission = (module, action) => {
  return (req, res, next) => {

    // 🔥 ADMIN = always allow
    if (req.user.role === "admin") {
      return next();
    }

    const permissions = req.user.roleId?.permissions;

    if (!permissions) {
      return res.status(403).json({ msg: "No permissions found" });
    }

    const modulePermission = permissions[module];

    if (!modulePermission || !modulePermission[action]) {
      return res.status(403).json({
        msg: `You are not allowed to ${action} in ${module}`
      });
    }

    next();
  };
};