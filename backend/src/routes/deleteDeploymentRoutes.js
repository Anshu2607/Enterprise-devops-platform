const express =
  require("express");

const router =
  express.Router();

const {

  deleteDeployment,

} = require(
  "../controllers/deleteDeploymentController"
);

router.delete(
  "/:id",
  deleteDeployment
);

module.exports =
  router;