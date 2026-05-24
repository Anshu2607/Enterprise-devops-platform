const deploymentQueue = require(
  "../queues/deploymentQueue"
);

const deployProject =
  async (req, res) => {

    try {

      console.log(
        "DEPLOY API HIT"
      );

      console.log(req.body);

      const {

        projectId,

        repoUrl,

      } = req.body;

      if (!projectId) {

        return res.status(400).json({

          message:
            "Project ID required",
        });
      }

      if (!repoUrl) {

        return res.status(400).json({

          message:
            "Repository URL required",
        });
      }

      console.log(
        "ADDING JOB TO QUEUE..."
      );

      const job =
        await deploymentQueue.add(

          "deploy-job",

          {

            projectId,

            repoUrl,
          }
        );

      console.log(
        "JOB ADDED:",
        job.id
      );

      res.status(200).json({

        message:
          "Deployment started",

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