const { exec } = require("child_process");

const util = require("util");

const execAsync = util.promisify(exec);

const { v4: uuidv4 } = require("uuid");

const runContainer = async (

  deploymentId,

  projectName

) => {

  const containerName =
    `deploy-${uuidv4()}`;

  const randomPort =
    Math.floor(
      4000 + Math.random() * 1000
    );

  console.log(
    "Starting Docker container..."
  );

  // SIMULATED CONTAINER RUN

  const command = `
    docker run -d
    --name ${containerName}
    -p ${randomPort}:3000
    nginx
  `;

  await execAsync(command);

  return {

    containerName,

    port: randomPort,
  };
};

module.exports = {
  runContainer,
};
