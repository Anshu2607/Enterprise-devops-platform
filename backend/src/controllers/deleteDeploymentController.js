const prisma = require(
  "../config/prisma"
);

const {

  stopContainer,

} = require(
  "../utils/stopContainer"
);

const deleteDeployment =
  async (req, res) => {

    try {

      const { id } = req.params;

      const deployment =
        await prisma.deployment.findUnique({

          where: { id },
        });

      if (!deployment) {

        return res.status(404).json({

          message:
            "Deployment not found",
        });
      }

      if (
        deployment.containerName
      ) {

        await stopContainer(

          deployment.containerName
        );
      }

      await prisma.deployment.delete({

        where: { id },
      });

      res.json({

        message:
          "Deployment deleted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server error",
      });
    }
};

module.exports = {
  deleteDeployment,
};