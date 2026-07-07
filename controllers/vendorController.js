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

  exports.getVendorDashboard = async (req, res) => {

    try {

        const total = await Vendor.countDocuments();

        const freight = await Vendor.countDocuments({

            serviceTypes: "Freight Forwarder"

        });

        const broker = await Vendor.countDocuments({

            serviceTypes: "Customs Broker"

        });

        const transporter = await Vendor.countDocuments({

            serviceTypes: "Transporter"

        });

        const warehouse = await Vendor.countDocuments({

            serviceTypes: "Warehouse"

        });

        const packing = await Vendor.countDocuments({

            serviceTypes: "Packing & Handling"

        });

        res.json({

            status: 1,

            data: {

                total,

                freight,

                broker,

                transporter,

                warehouse,

                packing

            }

        });

    }

    catch (err) {

        res.status(500).json({

            status: 0,

            message: err.message

        });

    }

};

exports.getVendorById = async (req, res) => {

  try {

      const vendor = await Vendor.findById(req.params.id);

      if (!vendor) {

          return res.status(404).json({

              status: 0,

              message: "Vendor not found"

          });

      }

      res.json({

          status: 1,

          data: vendor

      });

  }

  catch (err) {

      res.status(500).json({

          status: 0,

          message: err.message

      });

  }

};

exports.getVendorComparison = async (req, res) => {

  try {

      const vendors = await Vendor.find();

      const costs = vendors.map(v => v.estimatedCost);

      const min = Math.min(...costs);

      const max = Math.max(...costs);

      const avg = costs.reduce((a, b) => a + b, 0) / (costs.length || 1);

      res.json({

          status: 1,

          data: {

              averageCost: avg,

              lowestCost: min,

              highestCost: max

          }

      });

  }

  catch (err) {

      res.status(500).json({

          status: 0,

          message: err.message

      });

  }

};

exports.getVendorInsights = async (req, res) => {

  try {

      const data = await Vendor.aggregate([

          {

              $unwind: "$serviceTypes"

          },

          {

              $group: {

                  _id: "$serviceTypes",

                  total: {

                      $sum: 1

                  }

              }

          }

      ]);

      res.json({

          status: 1,

          data

      });

  }

  catch (err) {

      res.status(500).json({

          status: 0,

          message: err.message

      });

  }

};

exports.getRecommendedVendors = async (req, res) => {

  try {

      const shipment = await Shipment.findById(req.params.shipmentId);

      if (!shipment) {

          return res.status(404).json({

              status: 0,
              message: "Shipment not found"

          });

      }

      const vendors = await Vendor.find({

          status: "Active",

          transportModes: shipment.route.mode

      });

      const result = vendors.map(vendor => {

          let score = 0;

          // Route Match
          const routeMatched = vendor.routes.some(r =>

              r.origin === shipment.route.origin &&
              r.destination === shipment.route.destination

          );

          if (routeMatched)
              score += 40;

          // Rating
          score += vendor.rating * 10;

          // Verified
          if (vendor.verified)
              score += 10;

          // Response Time
          if (vendor.responseTime?.includes("min"))
              score += 10;

          return {

              ...vendor.toObject(),

              matchScore: score

          };

      });

      result.sort((a, b) => b.matchScore - a.matchScore);

      res.json({

          status: 1,

          data: result

      });

  }

  catch (err) {

      res.status(500).json({

          status: 0,

          message: err.message

      });

  }

};