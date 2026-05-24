const express = require("express");

const router = express.Router();

const {

  stopDeployment,

  restartDeployment,

  removeDeployment,

} = require(
  "../controllers/manageDeploymentController"
);

router.post(
  "/stop/:id",
  stopDeployment
);

router.post(
  "/restart/:id",
  restartDeployment
);

router.delete(
  "/delete/:id",
  removeDeployment
);

module.exports = router;
