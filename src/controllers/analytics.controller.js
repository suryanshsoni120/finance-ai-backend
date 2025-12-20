const mongoose = require("mongoose");
const Transaction = require("../models/transaction.model");

exports.getMonthlySummary = async (req, res) => {
    try {
        const { month, year } = req.query;

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const summary = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user),
                    date: { $gte: start, $lt: end }
                }
            },
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let income = 0;
        let expense = 0;

        summary.forEach(item => {
            if (item._id === "income") income = item.total;
            if (item._id === "expense") expense = item.total;
        });

        res.
            json({
                income,
                expense,
                savings: income - expense
            });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch summary", error });
    }
};

exports.getCategoryBreakdown = async (req, res) => {
    try {
        const { month, year } = req.query;

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const breakdown = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(req.user),
                    type: "expense",
                    date: { $gte: start, $lt: end }
                }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { total: -1 } }
        ]);

        res.json(breakdown);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch breakdown", error });
    }
};