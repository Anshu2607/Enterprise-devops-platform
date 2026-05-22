const deploymentQueue = require(
  "../queues/deploymentQueue"
);

const deployProject = async (req, res) => {

  try {

    const { projectName } = req.body;

    const job = await deploymentQueue.add(
      "deploy-job",
      {
        projectName,
      }
    );

    res.status(200).json({
      message: "Deployment started",
      jobId: job.id,
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
};