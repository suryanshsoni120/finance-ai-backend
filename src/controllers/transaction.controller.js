const Transaction = require("../models/transaction.model");
const { predictCategory } = require("../services/ai.service");

// CREATE
exports.createTransaction = async (req, res) => {
  try {
    let { category, description, isRecurring, frequency } = req.body;

    // --- Validation for Recurring ---
    // The logic to actually trigger the recurring transaction (e.g., creating a copy next month) would typically be handled by a separate Cron job or scheduled service.
    if (isRecurring && !frequency) {
      return res.status(400).json({
        message: "Frequency is required for recurring transactions"
      });
    }
    // --------------------------------

    if (!category && description) {
      const aiResult = await predictCategory(description);
      category = aiResult.category;
    }

    const transaction = await Transaction.create({
      ...req.body,
      category,
      user: req.user
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Failed to create transaction", error });
  }
};

// READ (user-specific)
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user }).sort({
      date: -1
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error });
  }
};

// UPDATE
exports.updateTransaction = async (req, res) => {
  try {
    const { isRecurring, frequency } = req.body;

    // --- Validation for Recurring ---
    if (isRecurring === true && !frequency) {
      // Only check if they are explicitly setting isRecurring to true without a frequency
      return res.status(400).json({ message: "Frequency is required for recurring transactions" });
    }
    // --------------------------------

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true, runValidators: true } // runValidators ensures schema validation triggers
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Failed to update transaction", error });
  }
};

// DELETE
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transaction", error });
  }
};