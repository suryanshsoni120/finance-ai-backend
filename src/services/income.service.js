const INCOME_KEYWORDS = {
  Salary: ["salary", "payroll"],
  Interest: ["interest", "fd interest", "rd interest"],
  Cashback: ["cashback", "reward"],
  Refund: ["refund", "reversal"],
  Bonus: ["bonus", "incentive"],
  Dividend: ["dividend"]
};

exports.predictIncomeCategory = (description = "") => {
  const text = description.toLowerCase();

  for (const [category, keywords] of Object.entries(INCOME_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) {
      return category;
    }
  }

  return "Other Income";
}