const { parseCSV } = require("../services/statementParser.service");
const { mapTransaction } = require("../services/categoryMapper.service");
const Transaction = require("../models/transaction.model");

exports.previewStatement = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "CSV file required" });
    }

    try {
        const rows = await parseCSV(req.file.buffer);
        const mapped = await Promise.all(
            rows.map(row => mapTransaction(row))
        );

        res.json({ transactions: mapped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to parse statement" });
    }
};

exports.confirmStatement = async (req, res) => {
    try {
        const transactions = req.body.transactions;

        if (!Array.isArray(transactions) || transactions.length === 0) {
            return res.status(400).json({ message: "No transactions to import" });
        }

        if (transactions.length > 1000) {
            return res.status(400).json({ message: "Too many rows" });
        }

        const docs = transactions.map(t => ({
            user: req.user,
            ...t
        }));

        await Transaction.insertMany(docs);

        res.json({ message: "Transactions imported successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to save transactions" });
    }
};
