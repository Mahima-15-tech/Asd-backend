const Shipment = require("../models/Shipment");
const ShipmentTracking = require("../models/ShipmentTracking");
const ShipmentDocument = require("../models/ShipmentDocument");
const ShipmentParty = require("../models/ShipmentParty");
const ShipmentCost = require("../models/ShipmentCost");
const Activity = require("../models/Activity");

exports.saveStep1 = async (req, res) => {
  const shipment = await Shipment.create({
    userId: req.user._id, 
    exporter: req.body,
    currentStep: 2
  });

  res.json({ status: 1, data: shipment });
};

  exports.saveStep2 = async (req, res) => {
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      {
        cargo: req.body,
        currentStep: 3
      },
      { new: true }
    );
  
    res.json({ status: 1, data: shipment });
  };exports.saveStep3 = async (req, res) => {
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      {
        route: req.body,
        currentStep: 4
      },
      { new: true }
    );
  
    res.json({ status: 1, data: shipment });
  };



exports.uploadDocs = async (req, res) => {
  const { shipmentId, docs } = req.body;

  const inserted = await ShipmentDocument.insertMany(
    docs.map(d => ({
      shipmentId,
      name: d.name,
      fileUrl: d.fileUrl,
      required: d.required
    }))
  );

  await Shipment.findByIdAndUpdate(shipmentId, {
    status: "In Transit",
    docsPending: false
  });

  res.json({ status: 1, data: inserted });
};

exports.getShipments = async (req, res) => {
    const { status, mode, search } = req.query;
  
    let query = {
      userId: req.user._id
    };
  
    if (status) query.status = status;
    if (mode) query["route.mode"] = mode;
  
    if (search) {
      query.$or = [
        { sbNumber: { $regex: search, $options: "i" } },
        { "exporter.companyName": { $regex: search, $options: "i" } }
      ];
    }
  
    const data = await Shipment.find(query)
      .populate("cargo.hsCode")
      .sort({ createdAt: -1 });
  
    res.json({ status: 1, data });
  };

  exports.getStats = async (req, res) => {

    const total = await Shipment.countDocuments();
  
    const inTransit = await Shipment.countDocuments({
      status: "In Transit"
    });
  
    const delivered = await Shipment.countDocuments({
      status: "Delivered"
    });
  
    const pendingDocs = await Shipment.countDocuments({
      status: "Pending Docs"
    });
  
    const customHold = await Shipment.countDocuments({
      status: "Custom Hold"
    });
  
    const revenueAgg = await Shipment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$revenue" }
        }
      }
    ]);
  
    res.json({
      status: 1,
      data: {
        total,
        inTransit,
        delivered,
        pendingDocs,
        customHold,
        revenue: revenueAgg[0]?.total || 0
      }
    });
  };

  exports.updateStatus = async (req, res) => {
    const { status } = req.body;
  
    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
  
    res.json({ status: 1, data: shipment });
  };

  exports.getShipmentDetails = async (req, res) => {
    try {
      const shipmentId = req.params.id;
  
      // Shipment Basic Details
      const shipment = await Shipment.findById(shipmentId)
.populate("cargo.hsCode")
.populate("userId","name email");
  
      if (!shipment) {
        return res.status(404).json({
          status: 0,
          message: "Shipment not found"
        });
      }
  
      // Shipment Tracking Timeline
      const tracking = await ShipmentTracking.find({
        shipmentId
      }).sort({ createdAt: 1 });
  
      // Shipment Documents
      const documents = await ShipmentDocument.find({
        shipmentId
      });
  
      // Shipment Parties
      const parties = await ShipmentParty.find({
        shipmentId
      });
  
      // Shipment Cost
      const costSummary = await ShipmentCost.findOne({
        shipmentId
      });
  
      // Shipment Activity
      const activity = await Activity.find({
        shipmentId
      }).sort({ createdAt: -1 });
  
      // Exporter
      const exporter =
        parties.find(p => p.type === "Exporter") || null;
  
      // Importer
      const importer =
        parties.find(p => p.type === "Importer") || null;
  
      // Notify Party
      const notifyParty =
        parties.find(p => p.type === "Notify") || null;
  
      // Header Section
      const header = {
        shipmentId: shipment.sbNumber,
        status: shipment.status,
        route: {
          origin: shipment.route.origin,
          destination: shipment.route.destination
        },
        etd: shipment.etd,
        eta: shipment.eta,
        goods: shipment.cargo.productName,
        estimatedCost: shipment.estimatedCost || 0,
        transitTime: shipment.transitTime || "-"
      };
  
      // Shipment Information
      const shipmentInfo = {
        shipmentId: shipment.sbNumber,
        mode: shipment.route.mode,
        carrier: shipment.route.carrier,
        hsCode: shipment.cargo.hsCode,
        goods: shipment.cargo.productName,
        quantity: shipment.cargo.quantity,
        weight: shipment.cargo.weight,
        incoterm: shipment.incoterm,
        awbNumber: shipment.awbNumber,
        totalVolume: shipment.totalVolume,
        origin: shipment.route.origin,
        destination: shipment.route.destination,
        etd: shipment.etd,
        eta: shipment.eta,
        transitTime: shipment.transitTime,
        lastUpdated: shipment.lastUpdated
      };
  
      
      // Shipment Overview
      const overview = {
        status: shipment.status,
        estimatedCost: shipment.estimatedCost,
        paidAmount: shipment.paidAmount,
        balanceAmount: shipment.balanceAmount,
        paymentStatus: shipment.paymentStatus,
        createdOn: shipment.createdAt,
        createdBy: shipment.userId,
        notes:shipment.notes,
        additionalInformation:shipment.additionalInformation
      };
  
      res.json({
        status: 1,
        message: "Shipment details fetched successfully",
  
        data: {
  
          header,
  
          tracking,
  
          shipmentInfo,
  
          overview,
  
          documents,
  
          parties: {
            exporter,
            importer,
            notifyParty
          },

          notes: shipment.notes,
  
          costSummary,
  
          activity
  
        }
  
      });
  
    } catch (err) {
  
      res.status(500).json({
        status: 0,
        message: err.message
      });
  
    }
  };


  exports.getShipmentTracking = async (req, res) => {
    try {
  
      const shipmentId = req.params.id;
  
      // Shipment
      const shipment = await Shipment.findById(shipmentId)
        .populate("cargo.hsCode");
  
      if (!shipment) {
        return res.status(404).json({
          status: 0,
          message: "Shipment not found"
        });
      }
  
      // Timeline
      const trackingTimeline = await ShipmentTracking.find({
        shipmentId
      }).sort({ createdAt: 1 });
  
      // Current Location
      const currentLocation = trackingTimeline.find(
        item => item.current === true
      );
  
      // Parties
      const parties = await ShipmentParty.find({
        shipmentId
      });
  
      // Documents
      const documents = await ShipmentDocument.find({
        shipmentId
      });
  
      // Notifications
      const notifications = await Activity.find({
        shipmentId
      })
        .sort({ createdAt: -1 })
        .limit(5);
  
      // Exporter
      const exporter =
        parties.find(x => x.type === "Exporter") || null;
  
      // Importer
      const importer =
        parties.find(x => x.type === "Importer") || null;
  
      // Notify
      const notifyParty =
        parties.find(x => x.type === "Notify") || null;
  
      // Header
      const header = {
        shipmentId: shipment.sbNumber,
        status: shipment.status,
        mode: shipment.route.mode,
        route: {
          origin: shipment.route.origin,
          destination: shipment.route.destination
        },
        etd: shipment.etd,
        eta: shipment.eta,
        transitTime: shipment.transitTime,
        estimatedCost: shipment.estimatedCost
      };
  
      // Live Tracking
      const liveTracking = {
        location: currentLocation?.location,
        city: currentLocation?.city,
        country: currentLocation?.country,
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        lastUpdate: currentLocation?.createdAt
      };
  
      // Shipment Info
      const shipmentInfo = {
        shipmentId: shipment.sbNumber,
        carrier: shipment.route.carrier,
        route: shipment.route,
        quantity: shipment.cargo.quantity,
        weight: shipment.cargo.weight,
        volume: shipment.totalVolume
      };
  
      // Transport Info
      const transportInfo = {
        awbNumber: shipment.awbNumber,
        incoterm: shipment.incoterm,
        carrier: shipment.route.carrier,
        etd: shipment.etd,
        eta: shipment.eta,
        transitTime: shipment.transitTime
      };
  
      res.json({
        status: 1,
        message: "Shipment tracking fetched successfully",
  
        data: {
  
          header,
  
          trackingTimeline,
  
          liveTracking,
  
          shipmentInfo,
  
          transportInfo,
  
          parties: {
            exporter,
            importer,
            notifyParty
          },
  
          documents,
  
          notifications
  
        }
  
      });
  
    } catch (err) {
  
      res.status(500).json({
        status: 0,
        message: err.message
      });
  
    }
  };