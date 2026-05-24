const { Worker } = require("bullmq");

const connection = require(
  "../config/redis"
);

const prisma = require(
  "../config/prisma"
);

const docker = require(
  "../config/docker"
);

const {

  getIO,

} = require("../socket");

const path = require("path");

const fs = require("fs");

const simpleGit =
  require("simple-git");

const { exec } =
  require("child_process");

const worker = new Worker(

  "deployment-queue",

  async (job) => {

    const {

      projectId,

      repoUrl,

    } = job.data;

    const io = getIO();

    const deployment =
      await prisma.deployment.create({

        data: {

          projectId,

          repoUrl,

          status: "cloning",

          logs:
            "Starting deployment...",
        },
      });

    const emitLog =
      async (status, logs) => {

        await prisma.deployment.update({

          where: {
            id: deployment.id,
          },

          data: {
            status,
            logs,
          },
        });

        io.emit(

          "deployment-log",

          {

            deploymentId:
              deployment.id,

            status,

            logs,
          }
        );
      };

    try {

      const deployPath =
        path.join(

          __dirname,

          "../../deployments",

          deployment.id
        );

      if (
        !fs.existsSync(
          deployPath
        )
      ) {

        fs.mkdirSync(

          deployPath,

          {
            recursive: true,
          }
        );
      }

      // CLONE

      await emitLog(

        "cloning",

        "Cloning repository..."
      );

      await simpleGit().clone(

        repoUrl,

        deployPath
      );

      // INSTALL

      await emitLog(

        "building",

        "Installing dependencies..."
      );

      await new Promise(

        (resolve, reject) => {

          exec(

            "npm install",

            {

              cwd: deployPath,
            },

            (error) => {

              if (error)
                reject(error);

              else resolve();
            }
          );
        }
      );

      // BUILD

      await emitLog(

        "building",

        "Building project..."
      );

      await new Promise(

        (resolve, reject) => {

          exec(

            "npm run build",

            {

              cwd: deployPath,
            },

            (error) => {

              if (error)
                reject(error);

              else resolve();
            }
          );
        }
      );

      // GENERATE PORT

      const port =
        Math.floor(
          3000 + Math.random() * 1000
        );

      const containerName =
        `deployment-${deployment.id}`;

      // CREATE CONTAINER

      await emitLog(

        "deploying",

        "Starting Docker container..."
      );

      const container =
        await docker.createContainer({

          Image: "node:20",

          name: containerName,

          Tty: true,

          ExposedPorts: {

            "3000/tcp": {},
          },

          HostConfig: {

            PortBindings: {

              "3000/tcp": [

                {
                  HostPort:
                    String(port),
                },
              ],
            },

            Binds: [

              `${deployPath}:/app`,
            ],
          },

          WorkingDir: "/app",

          Cmd: [

            "npm",

            "run",

            "dev",
          ],
        });

      await container.start();

      const deployedUrl =
        `http://localhost:${port}`;

      // SAVE DEPLOYMENT

      await prisma.deployment.update({

        where: {
          id: deployment.id,
        },

        data: {

          status: "completed",

          logs:
            "Deployment completed successfully",

          containerName,

          port,

          deployedUrl,
        },
      });

      io.emit(

        "deployment-log",

        {

          deploymentId:
            deployment.id,

          status:
            "completed",

          logs:
            "Deployment completed successfully",
        }
      );

    } catch (error) {

      console.log(error);

      await emitLog(

        "failed",

        String(error)
      );
    }
  },

  {
    connection,
  }
);

console.log(
  "Deployment worker started..."
);