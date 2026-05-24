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

const {

  generateK8sYaml,

} = require(
  "../utils/k8sGenerator"
);

const path = require("path");

const fs = require("fs");

const simpleGit =
  require("simple-git");

const { exec } =
  require("child_process");

console.log(
  "Starting deployment worker..."
);

const worker = new Worker(

  "deployment-queue",

  async (job) => {

    console.log(
      "JOB RECEIVED"
    );

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

        console.log(
          `[${status}] ${logs}`
        );

        await prisma.deployment.update({

          where: {
            id: deployment.id,
          },

          data: {
            status,
            logs,
          },
        });

        // SAFE SOCKET EMIT

        if (io) {

          io.emit(

            "deployment-log",

            {

              deploymentId:
                deployment.id,

              status,

              logs,
            }
          );
        }
      };

    try {

      // STEP 1 — DEPLOYMENT PATH

      console.log(
        "STEP 1"
      );

      const deployPath =
        path.join(

          __dirname,

          "../../deployments",

          deployment.id
        );

      console.log(
        deployPath
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

      // STEP 2 — CLONE

      console.log(
        "STEP 2"
      );

      await emitLog(

        "cloning",

        "Cloning repository..."
      );

      await simpleGit().clone(

        repoUrl,

        deployPath
      );

      console.log(
        "CLONE SUCCESS"
      );

      // STEP 3 — INSTALL

      console.log(
        "STEP 3"
      );

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

            (

              error,

              stdout,

              stderr

            ) => {

              console.log(
                stdout
              );

              console.log(
                stderr
              );

              if (error) {

                console.log(
                  "INSTALL FAILED"
                );

                reject(error);

              } else {

                console.log(
                  "INSTALL SUCCESS"
                );

                resolve(stdout);
              }
            }
          );
        }
      );

      // STEP 4 — BUILD

      console.log(
        "STEP 4"
      );

      await emitLog(

        "building",

        "Attempting build..."
      );

      try {

        await new Promise(

          (

            resolve,

            reject

          ) => {

            exec(

              "npm run build",

              {

                cwd: deployPath,
              },

              (

                error,

                stdout,

                stderr

              ) => {

                console.log(
                  stdout
                );

                console.log(
                  stderr
                );

                if (error) {

                  console.log(
                    "BUILD FAILED — CONTINUING"
                  );

                  resolve();

                } else {

                  console.log(
                    "BUILD SUCCESS"
                  );

                  resolve(stdout);
                }
              }
            );
          }
        );

      } catch (err) {

        console.log(
          "Skipping build step"
        );
      }

      // STEP 5 — PORT

      console.log(
        "STEP 5"
      );

      const port =
        Math.floor(
          3000 + Math.random() * 1000
        );

      const containerName =
        `deployment-${deployment.id}`;

      // STEP 6 — DOCKER

      console.log(
        "STEP 6"
      );

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

      console.log(
        "CONTAINER CREATED"
      );

      await container.start();

      console.log(
        "CONTAINER STARTED"
      );

      // STEP 7 — K8S YAML

      console.log(
        "STEP 7"
      );

      await emitLog(

        "deploying",

        "Generating Kubernetes manifests..."
      );

      generateK8sYaml(

        deployment.id,

        containerName,

        port
      );

      console.log(
        "YAML GENERATED"
      );

      // STEP 8 — COMPLETE

      console.log(
        "STEP 8"
      );

      const deployedUrl =
        `http://localhost:${port}`;

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

      if (io) {

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
      }

      console.log(
        "DEPLOYMENT COMPLETED"
      );

    } catch (error) {

      console.log(
        "DEPLOYMENT ERROR"
      );

      console.log(error);

      await prisma.deployment.update({

        where: {
          id: deployment.id,
        },

        data: {

          status: "failed",

          logs: String(error),
        },
      });
    }
  },

  {
    connection,
  }
);

worker.on(

  "completed",

  (job) => {

    console.log(

      `Job ${job.id} completed`
    );
  }
);

worker.on(

  "failed",

  (job, err) => {

    console.log(

      `Job ${job.id} failed`
    );

    console.log(err);
  }
);

worker.on(

  "error",

  (err) => {

    console.log(
      "WORKER ERROR:"
    );

    console.log(err);
  }
);

console.log(
  "Deployment worker started..."
);