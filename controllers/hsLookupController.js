const HSCode = require("../models/HSCode");
const Activity = require("../models/Activity");

exports.searchHSCode = async (req, res) => {
  try {
    const { query, exportCountry, importCountry, quantity } = req.body;

    if (!query) {
      return res.status(400).json({
        status: 0,
        message: "Product description required"
      });
    }

    // 🔍 Search logic (basic)
    const results = await HSCode.find({
      productName: { $regex: query, $options: "i" }
    }).limit(5);

    if (!results.length) {
      return res.json({
        status: 1,
        message: "No HS Code found",
        data: []
      });
    }

    // 🔹 Best match
    const bestMatch = results[0];

    // 🔹 Other matches
    const otherMatches = results.slice(1);

    // 🔹 Duty & Tax
    const duty = bestMatch.tradeInfo?.exportDuty || 0;
    const gst = bestMatch.tradeInfo?.gst || 0;

    // 🔹 Response
    const response = {
      bestMatch: {
        code: bestMatch.hsCode,
        description: bestMatch.description,
        matchScore: 98, // dummy
        confidence: "High",
        gst,
        duty
      },

      otherMatches: otherMatches.map(item => ({
        code: item.hsCode,
        description: item.description,
        matchScore: Math.floor(Math.random() * 50) + 50
      })),

      tradeInfo: {
        importPermitted: true,
        restriction: bestMatch.tradeInfo?.restrictedItem ? "Yes" : "None",
        licenseRequired: bestMatch.tradeInfo?.licenseRequired
      },

      documentRequired: [
        "Commercial Invoice",
        "Packing List",
        "Certificate of Origin",
        "Bill of Lading"
      ]
    };

    // 🔥 Activity log
    await Activity.create({
      userId: req.user._id,
      type: "HS_LOOKUP",
      message: `Searched HS Code for ${query}`
    });

    res.json({
      status: 1,
      data: response
    });

  } catch (err) {
    res.status(500).json({
      status: 0,
      message: err.message
    });
  }
};