const { generateInsights } = require("../services/insight.service");
const Transaction = require("../models/transaction.model");
const Budget = require("../models/budget.model");
const mongoose = require("mongoose");

exports.getMonthlyInsights = async (req, res) => {
    try {
        const { month, year } = req.query;

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        // Summary
        const summaryAgg = await Transaction.aggregate([
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
        summaryAgg.forEach(i => {
            if (i._id === "income") income = i.total;
            if (i._id === "expense") expense = i.total;
        });

        const summary = {
            income,
            expense,
            savings: income - expense
        };

        // Category breakdown
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

        // Budget alerts
        const budget = await Budget.findOne({
            user: req.user,
            month,
            year
        });

        const alerts = [];
        if (budget) {
            const totalSpent = breakdown.reduce((s, b) => s + b.total, 0);

            if (totalSpent > budget.totalBudget) {
                alerts.push({ type: "OVERALL" });
            }

            if (budget.categoryBudgets) {
                breakdown.forEach(b => {
                    const limit = budget.categoryBudgets.get(b._id);
                    if (limit && b.total > limit) {
                        alerts.push({
                            type: "CATEGORY",
                            category: b._id
                        });
                    }
                });
            }
        }

        // AI Insights
        const insights = await generateInsights({
            summary,
            breakdown,
            alerts
        });

        res.json({ insights });
    } catch (error) {
        res.status(500).json({ message: "Failed to generate insights", error });
    }
};