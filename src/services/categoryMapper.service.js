const { predictCategory } = require("./ai.service");
const { predictIncomeCategory } = require("./income.service");

exports.mapTransaction = async (row) => {
    const rawAmount = Number(row.amount);
    const type = rawAmount >= 0 ? "income" : "expense";
    const amount = Math.abs(rawAmount);

    let category = "Other";
    let confidence = 0.3;

    try {
        if (type === "income") {
            category = predictIncomeCategory(row.description);
            confidence = 0.9; // income rules are very reliable
        } else {
            const result = await predictCategory(row.description);
            category = result.category;
            confidence = result.confidence;
        }
    } catch (err) {
        // AI failure must NEVER break import
        console.warn("Category prediction failed:", err.message);
    }

    return {
        date: new Date(row.date),
        description: row.description.trim(),
        amount,
        type,
        category,
        confidence
    };
};
