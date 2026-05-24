const express = require("express");

const router = express.Router();

const prisma = require(
  "../config/prisma"
);

router.get("/", async (req, res) => {

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
});

module.exports = router;