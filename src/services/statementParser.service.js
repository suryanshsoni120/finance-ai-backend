const csv = require("csv-parser");
const { Readable } = require("stream");

exports.parseCSV = (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];

        Readable.from(buffer)
            .pipe(csv())
            .on("data", (row) => {
                const normalized = normalizeRow(row);
                if (normalized) {
                    results.push(normalized);
                }
            })
            .on("end", () => resolve(results))
            .on("error", reject);
    });
};

function normalizeRow(row) {
    const date = row.Date || row.date || row.TransactionDate || row["Transaction Date"];
    const description = row.Description || row.description || row.Narration || row.Particulars;
    const amount = parseAmount(row.Amount || row.amount || row.Debit || row.Credit);

    if (!date || !description || isNaN(amount)) {
        return null; // skip invalid rows
    }

    return {
        date: date.trim(),
        description: description.trim(),
        amount
    };
}

function parseAmount(value) {
    if (!value) return NaN;
    const cleaned = value.toString().replace(/,/g, "").trim();
    return Number(cleaned);
}
