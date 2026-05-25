const docker = require(
  "../config/docker"
);

const stopContainer =
  async (containerName) => {

    try {

      const container =
        docker.getContainer(
          containerName
        );

      await container.stop();

      await container.remove();

      return true;

    } catch (error) {

      console.log(error);

      return false;
    }
};

module.exports = {
  stopContainer,
};