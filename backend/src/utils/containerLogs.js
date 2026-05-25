const docker = require(
  "../config/docker"
);

const streamContainerLogs =
  async (

    containerName,

    io,

    deploymentId

  ) => {

    try {

      const container =
        docker.getContainer(
          containerName
        );

      const stream =
        await container.logs({

          follow: true,

          stdout: true,

          stderr: true,

          timestamps: false,
        });

      stream.on(

        "data",

        (chunk) => {

          const log =
            chunk.toString();

          console.log(log);

          if (io) {

            io.emit(

              "container-log",

              {

                deploymentId,

                log,
              }
            );
          }
        }
      );

    } catch (error) {

      console.log(
        "Container log stream error:"
      );

      console.log(error);
    }
};

module.exports = {
  streamContainerLogs,
};