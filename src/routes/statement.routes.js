const express = require("express");
const auth = require("../middlewares/auth.middleware");
const multer = require("multer");
const {
  previewStatement,
  confirmStatement
} = require("../controllers/statement.controller");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/preview", auth, upload.single("file"), previewStatement);
router.post("/confirm", auth, confirmStatement);

module.exports = router;
