const SavingsGoals = require("../models/savingsGoals.model.js");

// CREATE
exports.createGoal = async (req, res) => {
    const { name, targetAmount, currentAmount, targetDate } = req.body;
    if (!currentAmount || currentAmount <= 0) {
        return res.status(400).json({ message: "Amount must be positive" });
    }

    const goal = await SavingsGoals.create({
        user: req.user,
        name,
        targetAmount,
        currentAmount,
        targetDate
    });

    res.json(goal);
};

// READ (user-specific)
exports.getGoals = async (req, res) => {
    const goals = await SavingsGoals.find({ user: req.user });
    res.json(goals);
};

// Add amount to the current amount
exports.updateCurrentAmount = async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Amount must be positive" });
    }

    const goal = await SavingsGoals.findOne({
        _id: req.params.id,
        user: req.user
    });

    if (!goal) return res.status(404).json({ message: "Goal not found" });

    goal.currentAmount += amount;
    await goal.save();

    res.json(goal);
};

// Update Goal Details
exports.updateGoalDetails = async (req, res) => {
    try {
        const { name, targetAmount, targetDate } = req.body;
        if (!targetAmount || targetAmount <= 0) {
            return res.status(400).json({ message: "Amount must be positive" });
        }

        const goal = await SavingsGoals.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!goal) return res.status(404).json({ message: "Goal not found" });

        // Update fields
        if (name) goal.name = name;
        if (targetAmount) goal.targetAmount = targetAmount;
        if (targetDate !== undefined) goal.targetDate = targetDate; // Allow clearing date

        await goal.save();

        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: "Failed to update goal", error });
    }
};

// Delete Goal
exports.deleteGoal = async (req, res) => {
    try {
        const goal = await SavingsGoals.findOneAndDelete({
            _id: req.params.id,
            user: req.user
        });

        if (!goal) return res.status(404).json({ message: "Goal not found" });

        res.json({ message: "Goal deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete goal", error });
    }
};

// Withdraw from Goal
exports.withdrawFromGoal = async (req, res) => {
    try {
        const { amount } = req.body;

        const goal = await SavingsGoals.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!goal) return res.status(404).json({ message: "Goal not found" });

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be positive" });
        }

        if (amount > goal.currentAmount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        goal.currentAmount -= amount;
        await goal.save();

        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: "Failed to withdraw", error });
    }
};