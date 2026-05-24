const { Queue } = require("bullmq");

const connection = require(
  "../config/redis"
);

const deploymentQueue =
  new Queue(

    "deployment-queue",

    {
      connection,
    }
  );

module.exports =
  deploymentQueue;