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

  if (text.includes("salary")) return "Salary";
  if (text.includes("interest")) return "Interest";
  if (text.includes("cashback")) return "Cashback";
  if (text.includes("refund")) return "Refund";
  if (text.includes("bonus")) return "Bonus";
  if (text.includes("dividend")) return "Dividend";

  return "Other Income";
}