const prisma = require("../config/prisma");

const createProject = async (req, res) => {
  try {
    const { name, repository } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        repository,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.user.id,
      },
    });

    res.status(200).json({
      projects,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
};
