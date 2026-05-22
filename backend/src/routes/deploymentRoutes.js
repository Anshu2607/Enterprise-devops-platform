const express = require("express");

const router = express.Router();

const {
  deployProject,
} = require(
  "../controllers/deploymentController"
);

const {
  protect,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  protect,
  deployProject
);

module.exports = router;