const Role = require("../models/Role");

const allModules = [
  "dashboard",
  "booking",
  "shipment",
  "tracking",
  "documents",
  "earnings",
  "ads",
  "support",
  "settings"
];

const fullAccess = {
  view: true,
  add: true,
  edit: true,
  delete: true
};

// ✅ 1. CREATE ROLE
exports.createRole = async (req, res) => {
  try {
    let { name, permissions } = req.body;

    // 🔥 ensure all modules exist
    const finalPermissions = {};

    allModules.forEach((module) => {
      finalPermissions[module] = permissions?.[module] || {
        view: false,
        add: false,
        edit: false,
        delete: false
      };
    });

    // 🔥 ADMIN full access
    if (name === "admin") {
      allModules.forEach((module) => {
        finalPermissions[module] = fullAccess;
      });
    }

    const role = await Role.create({
      name,
      permissions: finalPermissions
    });

    res.json({
      status: 1,
      message: "Role created successfully",
      data: role
    });

  } catch (err) {
    res.status(500).json({
      status: 0,
      message: err.message
    });
  }
};

// ✅ 2. GET ALL ROLES (Left panel)
const User = require("../models/user");

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();

    const rolesWithCount = await Promise.all(
      roles.map(async (role) => {
        const userCount = await User.countDocuments({
          roleId: role._id
        });

        return {
          ...role.toObject(),
          userCount
        };
      })
    );

    res.json({
      status: 1,
      data: rolesWithCount
    });

  } catch (err) {
    res.status(500).json({
      status: 0,
      message: err.message
    });
  }
};


// ✅ 3. GET SINGLE ROLE (Right panel)
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        status: 0,
        message: "Role not found"
      });
    }

    res.json({
      status: 1,
      data: role
    });

  } catch (err) {
    res.status(500).json({
      status: 0,
      message: err.message
    });
  }
};


// ✅ 4. UPDATE PERMISSIONS (Save Changes)
exports.updateRole = async (req, res) => {
  try {
    const { permissions, name } = req.body;

    const finalPermissions = {};

    allModules.forEach((module) => {
      finalPermissions[module] = permissions?.[module] || {
        view: false,
        add: false,
        edit: false,
        delete: false
      };
    });

    const updated = await Role.findByIdAndUpdate(
      req.params.id,
      {
        name,
        permissions: finalPermissions
      },
      { new: true }
    );

    res.json({
      status: 1,
      message: "Role updated successfully",
      data: updated
    });

  } catch (err) {
    res.status(500).json({
      status: 0,
      message: err.message
    });
  }
};


// ✅ 5. DELETE ROLE (optional)
exports.deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);

    res.json({
      status: 1,
      message: "Role deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      status: 0,
      message: err.message
    });
  }
};