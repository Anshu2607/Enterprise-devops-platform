const { Worker } = require("bullmq");

const connection = require("../config/redis");

const worker = new Worker(
  "deploymentQueue",

  async (job) => {
    console.log("Starting deployment for:", job.data.projectName);
    global.io.emit("deployment-log", {
      message: `Starting deployment for ${projectName}`,
    });

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Deployment completed for:", job.data.projectName);
    global.io.emit("deployment-log", {
      message: `Deployment completed for ${projectName}`,
    });
  },

  {
    connection,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed`, err);
});
