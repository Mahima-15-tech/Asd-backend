const Vendor = require("../models/Vendor");
const Shipment = require("../models/Shipment"); 

exports.createVendor = async (req, res) => {
    try {
      const vendor = await Vendor.create(req.body);
  
      res.json({
        status: 1,
        message: "Vendor created",
        data: vendor
      });
  
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  };

  exports.getVendors = async (req, res) => {
    try {
      const { search = "", type, status, page = 1, limit = 10 } = req.query;
  
      let query = {};
  
      // 🔍 search
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
  
      // 🔽 filter
      if (type) query.type = type;
      if (status) query.status = status;
  
      const vendors = await Vendor.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 });
  
      const total = await Vendor.countDocuments(query);
  
      res.json({
        status: 1,
        data: vendors,
        total
      });
  
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  };

  exports.getVendor = async (req, res) => {
    try {
      const vendor = await Vendor.findById(req.params.id);
  
      res.json({
        status: 1,
        data: vendor
      });
  
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  };

  exports.updateVendor = async (req, res) => {
    try {
      const updated = await Vendor.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
  
      res.json({
        status: 1,
        data: updated
      });
  
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  };

  exports.deleteVendor = async (req, res) => {
    try {
      await Vendor.findByIdAndUpdate(req.params.id, {
        status: "inactive"
      });
  
      res.json({
        status: 1,
        message: "Vendor deactivated"
      });
  
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  };

  exports.updateShipmentCount = async () => {
    const vendors = await Vendor.find();
  
    for (let v of vendors) {
      const count = await Shipment.countDocuments({
        "route.carrier": v.name,
        status: "In Transit"
      });
  
      await Vendor.findByIdAndUpdate(v._id, {
        activeShipments: count
      });
    }
  };


  exports.getVendorStats = async (req, res) => {
    try {
      const total = await Vendor.countDocuments();
  
      const active = await Vendor.countDocuments({ status: "active" });
  
      const avgRating = await Vendor.aggregate([
        {
          $group: {
            _id: null,
            avg: { $avg: "$rating" }
          }
        }
      ]);
  
      res.json({
        status: 1,
        data: {
          total,
          active,
          avgRating: avgRating[0]?.avg || 0
        }
      });
  
    } catch (err) {
      res.status(500).json({ status: 0, message: err.message });
    }
  };