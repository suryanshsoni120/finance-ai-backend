const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { upsertBudget, getBudget, checkOverspend } = require("../controllers/budget.controller");



const router = express.Router();

router.use(auth);

router.post("/", upsertBudget);
router.get("/", getBudget);
router.get("/overspend", checkOverspend);

module.exports = router;