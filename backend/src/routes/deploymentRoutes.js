const express = require("express");

const router = express.Router();

const {

  deployProject,

} = require(
  "../controllers/deploymentController"
);

router.post(
  "/",
  deployProject
);

module.exports = router;