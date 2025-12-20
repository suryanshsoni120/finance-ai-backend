const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { getCategories } = require("../controllers/category.controller");

const router = express.Router();

router.use(auth);
router.get("/", getCategories);

module.exports = router;