// 🔹 MODELS
const Shipment = require("../models/Shipment");
const ShipmentDocument = require("../models/ShipmentDocument");




exports.saveStep1 = async (req, res) => {
    const shipment = await Shipment.create({
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
  
    let query = {};
  
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