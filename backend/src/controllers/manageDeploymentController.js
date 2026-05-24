const prisma = require(
  "../config/prisma"
);

const {

  stopContainer,

  startContainer,

  deleteContainer,

} = require(
  "../utils/dockerManager"
);

const stopDeployment =
  async (req, res) => {

    try {

      const { id } = req.params;

      const deployment =
        await prisma.deployment.findUnique({

          where: { id },
        });

      await stopContainer(
        deployment.containerName
      );

      await prisma.deployment.update({

        where: { id },

        data: {
          status: "stopped",
        },
      });

      res.status(200).json({

        message:
          "Deployment stopped",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: "Server error",
      });
    }
};

const restartDeployment =
  async (req, res) => {

    try {

      const { id } = req.params;

      const deployment =
        await prisma.deployment.findUnique({

          where: { id },
        });

      await startContainer(
        deployment.containerName
      );

      await prisma.deployment.update({

        where: { id },

        data: {
          status: "running",
        },
      });

      res.status(200).json({

        message:
          "Deployment restarted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: "Server error",
      });
    }
};

const removeDeployment =
  async (req, res) => {

    try {

      const { id } = req.params;

      const deployment =
        await prisma.deployment.findUnique({

          where: { id },
        });

      await deleteContainer(
        deployment.containerName
      );

      await prisma.deployment.delete({

        where: { id },
      });

      res.status(200).json({

        message:
          "Deployment deleted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message: "Server error",
      });
    }
};

module.exports = {

  stopDeployment,

  restartDeployment,

  removeDeployment,
};