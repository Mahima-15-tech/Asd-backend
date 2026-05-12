const Ad = require("../models/Ad");
const AdAnalytics = require("../models/AdAnalytics");


// 🔹 CREATE AD
exports.createAd = async (req, res) => {
  try {
    const ad = await Ad.create(req.body);

    res.json({ status: 1, data: ad });

  } catch (err) {
    res.status(500).json({ status: 0, message: err.message });
  }
};



// 🔹 GET ADS (with filters)
exports.getAds = async (req, res) => {
  try {
    const {
      search = "",
      status,
      placement,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (status) query.status = status;
    if (placement) query.placement = placement;

    if (startDate && endDate) {
      query.$and = [
        { startDate: { $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate) } }
      ];
    }

    const data = await Ad.find(query)
      .sort({ priority: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Ad.countDocuments(query);

    res.json({ status: 1, data, total });

  } catch (err) {
    res.status(500).json({ status: 0, message: err.message });
  }
};



// 🔹 UPDATE AD
exports.updateAd = async (req, res) => {
  const updated = await Ad.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ status: 1, data: updated });
};



// 🔹 DELETE AD
exports.deleteAd = async (req, res) => {
  await Ad.findByIdAndDelete(req.params.id);

  res.json({ status: 1, message: "Deleted" });
};



// 🔹 DUPLICATE AD
exports.duplicateAd = async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  const obj = ad.toObject();
delete obj._id;

const newAd = await Ad.create({
  ...obj,
  title: ad.title + " Copy"
});

  res.json({ status: 1, data: newAd });
};



// 🔹 CHANGE STATUS (pause/activate)
exports.changeStatus = async (req, res) => {
  const { status } = req.body;

  const ad = await Ad.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json({ status: 1, data: ad });
};



// 🔹 UPDATE PRIORITY (drag)
exports.updatePriority = async (req, res) => {
  const { list } = req.body;
  // [{id, priority}]

  const bulkOps = list.map(item => ({
    updateOne: {
      filter: { _id: item.id },
      update: { priority: item.priority }
    }
  }));
  
  await Ad.bulkWrite(bulkOps);

  res.json({ status: 1, message: "Updated" });
};



// 🔹 PREVIEW AD
exports.getAdPreview = async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  res.json({
    status: 1,
    data: ad
  });
};



// 🔹 DASHBOARD STATS
exports.getStats = async (req, res) => {
  const totalAds = await Ad.countDocuments();

  const impressions = await AdAnalytics.aggregate([
    { $group: { _id: null, total: { $sum: "$impressions" } } }
  ]);
  
  const clicks = await AdAnalytics.aggregate([
    { $group: { _id: null, total: { $sum: "$clicks" } } }
  ]);

  const ctr =
    impressions[0]?.total > 0
      ? (clicks[0]?.total / impressions[0]?.total) * 100
      : 0;

  res.json({
    status: 1,
    data: {
      totalAds,
      impressions: impressions[0]?.total || 0,
      clicks: clicks[0]?.total || 0,
      ctr: ctr.toFixed(2)
    }
  });
};



// 🔹 PERFORMANCE GRAPH
exports.getPerformance = async (req, res) => {
  const { startDate, endDate } = req.query;

  const data = await AdAnalytics.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: "$date",
        impressions: { $sum: "$impressions" },
        clicks: { $sum: "$clicks" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({ status: 1, data });
};



// 🔹 ANALYTICS PAGE
exports.getAnalytics = async (req, res) => {
  const { startDate, endDate } = req.query;

  const data = await AdAnalytics.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  });

  res.json({ status: 1, data });
};