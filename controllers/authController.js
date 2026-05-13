const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const Role = require("../models/Role");


const isValidPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

exports.signupUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, captchaToken } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    if (!captchaToken) {
      return res.status(400).json({ msg: "Captcha required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    // 🔥 password validation
if (!isValidPassword(password)) {
  return res.status(400).json({
    msg: "Password must be 8 chars, 1 uppercase, 1 number"
  });
}

// 🔥 email validation
if (!email.includes("@")) {
  return res.status(400).json({ msg: "Invalid email" });
}

    const hashedPassword = await bcrypt.hash(password, 10);



    const role = await Role.findOne({ name: "user" });

    await User.create({
      name,
      email,
      password: hashedPassword,
      roleId: role._id // ✅ FIX
    });

    res.json({ msg: "User signup successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signupB2B = async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        confirmPassword,
        companyName,
        gstNumber,
        importExportId,
        captchaToken
      } = req.body;
  
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Passwords do not match" });
      }
  
      if (!captchaToken) {
        return res.status(400).json({ msg: "Captcha required" });
      }
  
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ msg: "Email already exists" });
      }

      // 🔥 required field
if (!companyName) {
  return res.status(400).json({ msg: "Company name required" });
}

// 🔥 password validation
if (!isValidPassword(password)) {
  return res.status(400).json({
    msg: "Password must be 8 chars, 1 uppercase, 1 number"
  });
}
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const role = await Role.findOne({ name: "b2b" });

      await User.create({
        name,
        email,
        password: hashedPassword,
        roleId: role._id, // ✅ FIX
        companyName,
        gstNumber,
        importExportId
      });
  
      res.json({ msg: "B2B signup successful" });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.login = async (req, res) => {
    try {
      const { email, password, type } = req.body; 
  
      const user = await User.findOne({ email })
        .select("+password")
        .populate("roleId");
  
      if (!user) return res.status(400).json({ msg: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid password" });
  
      // 🔥 ROLE CHECK (IMPORTANT)
      if (type === "admin" && user.roleId.name !== "admin") {
        return res.status(403).json({ msg: "Admin access only" });
      }
  
      if (type === "user" && user.roleId.name !== "user") {
        return res.status(403).json({ msg: "User access only" });
      }
  
      const token = jwt.sign(
        {
          id: user._id,
          role: user.roleId.name
        },
        process.env.JWT_SECRET
      );
  
      user.password = undefined;
  
      res.json({ msg: "Login success", token, user });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.sendOtp = async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
  
    await user.save();
  
    console.log("OTP:", otp);
  
    res.json({ msg: "OTP sent" });
  };

  exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
  
    user.isVerified = true;
    await user.save();
  
    res.json({ msg: "OTP verified" });
  };


  exports.resetPassword = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }
  
    if (!isValidPassword(password)) {
      return res.status(400).json({
        msg: "Password must be 8 chars, 1 uppercase, 1 number"
      });
    }
  
    const user = await User.findOne({ email });
  
    if (!user.isVerified) {
      return res.status(400).json({ msg: "OTP not verified" });
    }
  
    const hashed = await bcrypt.hash(password, 10);
  
    user.password = hashed;
    user.isVerified = false;
    user.otp = null;
    user.otpExpiry = null;
  
    await user.save();
  
    res.json({ msg: "Password reset successful" });
  };

  exports.createStaff = async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!isValidPassword(password)) {
      return res.status(400).json({
        msg: "Weak password"
      });
    }
  
    const hashed = await bcrypt.hash(password, 10);
  
    const staff = await User.create({
      name,
      email,
      password: hashed,
      role: "staff"
    });
  
    res.json({ msg: "Staff created", staff });
  };

  const Role = require("../models/Role");

exports.createAdmin = async (req, res) => {
  const bcrypt = require("bcryptjs");

  const adminRole = await Role.findOne({ name: "admin" });

  const hashed = await bcrypt.hash("123456", 10);

  const admin = await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashed,
    roleId: adminRole._id // 🔥 IMPORTANT
  });

  res.json(admin);
};

  exports.resendOtp = async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
  
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
  
    await user.save();
  
    console.log("RESEND OTP:", otp);
  
    res.json({ msg: "OTP resent" });
  };