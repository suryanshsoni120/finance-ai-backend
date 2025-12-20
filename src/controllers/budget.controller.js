const mongoose = require("mongoose");
const Budget = require("../models/budget.model");
const Transaction = require("../models/transaction.model");

// CREATE or UPDATE budget
exports.upsertBudget = async (req, res) => {
    try {
        const { month, year, totalBudget, categoryBudgets } = req.body;

        const budget = await Budget.findOneAndUpdate(
            {
                user: req.user,
                month,
                year
            },
            {
                totalBudget,
                categoryBudgets
            },
            { upsert: true, new: true }
        );

        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: "Failed to save budget", error });
    }
};

// GET budget
exports.getBudget = async (req, res) => {
    try {
        const { month, year } = req.query;

        const budget = await Budget.findOne({
            user: req.user,
            month,
            year
        });

        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch budget", error });
    }
};

exports.checkOverspend = async (req, res) => {
    try {
        const { month, year } = req.query;

        const budget = await Budget.findOne({
            user: req.user,
            month,
            year
        });

        if (!budget) {
            return res.json({ message: "No budget set" });
        }

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const expenses = await Transaction.aggregate([
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
            }
        ]);

        let totalSpent = expenses.reduce((sum, e) => sum + e.total, 0);

        const alerts = [];

        // overall budget
        if (totalSpent > budget.totalBudget) {
            alerts.push({
                type: "OVERALL",
                message: "You have exceeded your total monthly budget"
            });
        }

        // category-level budget
        if (budget.categoryBudgets) {
            expenses.forEach(e => {
                const limit = budget.categoryBudgets.get(e._id);
                if (limit && e.total > limit) {
                    alerts.push({
                        type: "CATEGORY",
                        category: e._id,
                        message: `You have exceeded your ${e._id} budget`
                    });
                }
            });
        }

        res.json({
            totalSpent,
            alerts
        });
    } catch (error) {
        res.status(500).json({ message: "Overspend check failed", error });
    }
};