const Shipment=require("../models/Shipment");
const Buyer=require("../models/Buyer");

exports.getDashboard = async (req, res) => {
    try {

        const totalBuyers = await Buyer.countDocuments();

        const activeBuyers = await Buyer.countDocuments({
            active: true
        });

        const countries = await Buyer.distinct("country");

        const shipmentStats = await Shipment.aggregate([
            {
                $group: {
                    _id: null,
                    shipments: { $sum: 1 },
                    tradeValue: { $sum: "$cargo.value" },
                    avgShipmentValue: { $avg: "$cargo.value" },
                    avgLeadTime: { $avg: "$leadTime" }
                }
            }
        ]);

        return res.status(200).json({
            status: 1,
            message: "Buyer dashboard fetched successfully",
            data: {
                totalBuyers,
                activeBuyers,
                totalShipments: shipmentStats[0]?.shipments || 0,
                totalTradeValue: shipmentStats[0]?.tradeValue || 0,
                countriesCovered: countries.length,
                avgShipmentValue: Math.round(shipmentStats[0]?.avgShipmentValue || 0),
                avgLeadTime: Math.round(shipmentStats[0]?.avgLeadTime || 0)
            }
        });

    } catch (error) {

        return res.status(500).json({
            status: 0,
            message: error.message
        });

    }
};

exports.getTopBuyers = async (req, res) => {
    try {

        const totalTrade = await Buyer.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalTradeValue" }
                }
            }
        ]);

        const totalValue = totalTrade[0]?.total || 0;

        const buyers = await Buyer.find()
            .sort({ totalTradeValue: -1 })
            .limit(10);

        const data = buyers.map(item => ({
            buyer: item.companyName,
            country: item.country,
            tradeValue: item.totalTradeValue,
            share: totalValue
                ? ((item.totalTradeValue / totalValue) * 100).toFixed(2)
                : 0
        }));

        return res.status(200).json({
            status: 1,
            message: "Top buyers fetched successfully",
            data
        });

    } catch (error) {

        return res.status(500).json({
            status: 0,
            message: error.message
        });

    }
};

exports.getTradeTrend = async (req, res) => {
    try {

        const trend = await Shipment.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$shipmentDate"
                        }
                    },
                    tradeValue: {
                        $sum: "$cargo.value"
                    },
                    shipments: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id": 1
                }
            }
        ]);

        return res.status(200).json({
            status: 1,
            message: "Trade trend fetched successfully",
            data: trend
        });

    } catch (error) {

        return res.status(500).json({
            status: 0,
            message: error.message
        });

    }
};

exports.getCountries = async (req, res) => {
    try {

        const countries = await Buyer.aggregate([
            {
                $group: {
                    _id: "$country",
                    buyers: { $sum: 1 },
                    tradeValue: { $sum: "$totalTradeValue" }
                }
            },
            {
                $sort: {
                    tradeValue: -1
                }
            }
        ]);

        return res.status(200).json({
            status: 1,
            message: "Buyer countries fetched successfully",
            data: countries
        });

    } catch (error) {

        return res.status(500).json({
            status: 0,
            message: error.message
        });

    }
};


exports.getGrowthBuyers = async (req, res) => {
    try {

        const buyers = await Buyer.find()
            .sort({
                totalTradeValue: -1
            })
            .limit(10);

        const data = buyers.map(item => ({
            buyer: item.companyName,
            tradeValue: item.totalTradeValue,
            growth: item.qualityScore || 0
        }));

        return res.status(200).json({
            status: 1,
            message: "Top growth buyers fetched successfully",
            data
        });

    } catch (error) {

        return res.status(500).json({
            status: 0,
            message: error.message
        });

    }
};

exports.getBuyerConcentration = async (req, res) => {
    try {

        const buyers = await Buyer.find().sort({
            totalTradeValue: -1
        });

        const totalTrade = buyers.reduce(
            (sum, item) => sum + (item.totalTradeValue || 0),
            0
        );

        const top10 = buyers
            .slice(0, 10)
            .reduce((sum, item) => sum + item.totalTradeValue, 0);

        const top50 = buyers
            .slice(0, 50)
            .reduce((sum, item) => sum + item.totalTradeValue, 0);

        const top100 = buyers
            .slice(0, 100)
            .reduce((sum, item) => sum + item.totalTradeValue, 0);

        const buyerTypes = await Buyer.aggregate([
            {
                $group: {
                    _id: "$buyerType",
                    count: { $sum: 1 }
                }
            }
        ]);

        return res.status(200).json({
            status: 1,
            message: "Buyer concentration fetched successfully",
            data: {
                top10Share: totalTrade
                    ? ((top10 / totalTrade) * 100).toFixed(2)
                    : 0,
                top50Share: totalTrade
                    ? ((top50 / totalTrade) * 100).toFixed(2)
                    : 0,
                top100Share: totalTrade
                    ? ((top100 / totalTrade) * 100).toFixed(2)
                    : 0,
                buyerTypes
            }
        });

    } catch (error) {

        return res.status(500).json({
            status: 0,
            message: error.message
        });

    }
};

exports.getRecentShipments = async (req, res) => {
    try {

        const buyerId = req.query.buyerId;

        const filter = {};

        if (buyerId) {
            filter["buyer.buyerId"] = buyerId;
        }

        const shipments = await Shipment.find(filter)
            .populate("cargo.hsCode", "hsCode description")
            .sort({ shipmentDate: -1 })
            .limit(10);

        return res.status(200).json({
            status: 1,
            message: "Recent buyer shipments fetched successfully",
            data: shipments
        });

    } catch (error) {

        return res.status(500).json({
            status: 0,
            message: error.message
        });

    }
};

exports.getFilterOptions = async (req, res) => {
    try {

        const buyers = await Buyer.find({}, "_id companyName");

        const countries = await Buyer.distinct("country");

        const buyerTypes = await Buyer.distinct("buyerType");

        const products = await Shipment.distinct("cargo.productName");

        const hsCodes = await Shipment.distinct("cargo.hsCode");

        const shipmentRanges = [
            100,
            500,
            1000,
            5000,
            10000
        ];

        const tradeValueRanges = [
            100000,
            500000,
            1000000,
            5000000,
            10000000
        ];

        return res.status(200).json({
            status: 1,
            message: "Buyer filter options fetched successfully",
            data: {
                buyers,
                countries,
                products,
                hsCodes,
                buyerTypes,
                shipmentRanges,
                tradeValueRanges
            }
        });

    } catch (error) {

        return res.status(500).json({
            status: 0,
            message: error.message
        });

    }
};