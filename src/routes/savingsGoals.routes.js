const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  createGoal,
  getGoals,
  updateGoalDetails,
  updateCurrentAmount,
  deleteGoal,
  withdrawFromGoal
} = require("../controllers/savingsGoals.controller");

const router = express.Router();

/* Create Goal */
router.post("/", auth, createGoal);

/* Get Goals */
router.get("/", auth, getGoals);

/* Update Goal Amount */
router.post("/:id/contribute", auth, updateCurrentAmount);

/* Withdraw from Goal Amount */
router.post("/:id/withdraw", auth, withdrawFromGoal);

/* Update Goal Details */
router.put("/:id", auth, updateGoalDetails); 

/* Delete Goal */
router.delete("/:id", auth, deleteGoal);

module.exports = router;