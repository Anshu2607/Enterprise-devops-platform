const { Worker } = require("bullmq");

const path = require("path");

const fs = require("fs-extra");

const simpleGit = require("simple-git");

const connection = require("../config/redis");

const prisma = require("../config/prisma");

const {
  generateK8sFiles,
} = require("../utils/k8sGenerator");

const {
  runContainer,
} = require("../utils/dockerManager");

const worker = new Worker(

  "deploymentQueue",

  async (job) => {

    const {
      deploymentId,
      projectName,
      repository,
    } = job.data;

    const deploymentPath = path.join(
      __dirname,
      "../../deployments",
      deploymentId
    );

    const artifactPath = path.join(
      __dirname,
      "../../artifacts",
      `${deploymentId}.txt`
    );

    try {

      console.log(
        "Starting deployment for:",
        projectName
      );

      // STEP 1 — CLONE REPOSITORY

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status: "cloning",

          logs: "Cloning repository...",
        },
      });

      console.log("Cloning repository...");

      await simpleGit().clone(
        repository,
        deploymentPath
      );

      // STEP 2 — DETECT DOCKERFILE

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status: "detecting",

          logs: "Detecting Dockerfile...",
        },
      });

      console.log(
        "Detecting Dockerfile..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      // STEP 3 — INSTALL DEPENDENCIES

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status: "installing",

          logs: "Installing dependencies...",
        },
      });

      console.log(
        "Installing dependencies..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );

      // STEP 4 — BUILD APPLICATION

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status: "building",

          logs: "Building application...",
        },
      });

      console.log(
        "Building application..."
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 4000)
      );

      // STEP 5 — CREATE ARTIFACT

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status:
            "creating-artifact",

          logs:
            "Creating deployment artifact...",
        },
      });

      console.log(
        "Creating deployment artifact..."
      );

      await fs.writeFile(

        artifactPath,

        `
Deployment Artifact
====================

Project:
${projectName}

Repository:
${repository}

Deployment ID:
${deploymentId}

Status:
SUCCESS

Generated At:
${new Date().toISOString()}
        `
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );

      // STEP 6 — GENERATE KUBERNETES FILES

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status:
            "generating-k8s",

          logs:
            "Generating Kubernetes manifests...",
        },
      });

      console.log(
        "Generating Kubernetes manifests..."
      );

      await generateK8sFiles(

        deploymentId,

        projectName
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );

      // STEP 7 — DEPLOY CONTAINER

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status: "deploying",

          logs:
            "Deploying Docker container...",
        },
      });

      console.log(
        "Deploying Docker container..."
      );

      const containerData =
        await runContainer(

          deploymentId,

          projectName
        );

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          containerName:
            containerData.containerName,

          port:
            containerData.port,
        },
      });

      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );

      // STEP 8 — COMPLETE

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status: "completed",

          logs:
            "Deployment completed successfully",
        },
      });

      console.log(
        "Deployment completed for:",
        projectName
      );

    } catch (error) {

      console.log(error);

      await prisma.deployment.update({

        where: {
          id: deploymentId,
        },

        data: {

          status: "failed",

          logs: error.message,
        },
      });
    }
  },

  {
    connection,
  }
);

worker.on("completed", (job) => {

  console.log(
    `Job ${job.id} completed`
  );
});

worker.on("failed", (job, err) => {

  console.log(
    `Job ${job.id} failed`,
    err
  );
});