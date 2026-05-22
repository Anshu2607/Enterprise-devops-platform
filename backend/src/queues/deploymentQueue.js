const { Queue } = require("bullmq");

const connection = require("../config/redis");

const deploymentQueue = new Queue(
  "deploymentQueue",
  {
    connection,
  }
);

module.exports = deploymentQueue;
