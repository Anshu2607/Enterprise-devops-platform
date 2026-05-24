const deploymentQueue = require(
  "../queues/deploymentQueue"
);

const prisma = require("../config/prisma");

const deployProject = async (req, res) => {

  try {

    const { projectId } = req.body;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {

      return res.status(404).json({
        message: "Project not found",
      });
    }

    const deployment =
      await prisma.deployment.create({
        data: {
          projectId,
          status: "queued",
          logs: "Deployment queued...",
        },
      });

    await deploymentQueue.add(
      "deploy-job",
      {
        deploymentId: deployment.id,

        projectName: project.name,

        repository: project.repository,
      }
    );

    res.status(200).json({
      message: "Deployment started",

      deployment,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getDeployments = async (req, res) => {

  try {

    const deployments =
      await prisma.deployment.findMany({

        include: {
          project: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      deployments,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  deployProject,
  getDeployments,
};