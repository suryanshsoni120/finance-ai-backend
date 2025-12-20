const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { getMonthlyInsights } = require("../controllers/insight.controller");

const router = express.Router();
router.use(auth);

router.get("/monthly", getMonthlyInsights);

module.exports = router;