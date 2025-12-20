const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
    getMonthlySummary,
    getCategoryBreakdown
} = require("../controllers/analytics.controller");

const router = express.Router();

router.use(auth);

router.get("/summary", getMonthlySummary);
router.get("/category-breakdown", getCategoryBreakdown);

module.exports = router;