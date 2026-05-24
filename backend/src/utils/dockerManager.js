const { exec } = require("child_process");

const util = require("util");

const execAsync =
  util.promisify(exec);

const { v4: uuidv4 } =
  require("uuid");

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

  const command = `
    docker run -d
    --name ${containerName}
    -p ${randomPort}:80
    nginx
  `;

  await execAsync(command);

  return {

    containerName,

    port: randomPort,
  };
};

const stopContainer = async (
  containerName
) => {

  const command = `
    docker stop ${containerName}
  `;

  await execAsync(command);
};

const startContainer = async (
  containerName
) => {

  const command = `
    docker start ${containerName}
  `;

  await execAsync(command);
};

const deleteContainer = async (
  containerName
) => {

  const command = `
    docker rm -f ${containerName}
  `;

  await execAsync(command);
};

module.exports = {

  runContainer,

  stopContainer,

  startContainer,

  deleteContainer,
};