const fs = require("fs-extra");

const path = require("path");

const YAML = require("yaml");

const generateK8sFiles = async (

  deploymentId,

  projectName

) => {

  const namespace = {

    apiVersion: "v1",

    kind: "Namespace",

    metadata: {
      name:
        `project-${deploymentId}`,
    },
  };

  const deployment = {

    apiVersion: "apps/v1",

    kind: "Deployment",

    metadata: {
      name:
        `${projectName.toLowerCase()}-deployment`,
      namespace:
        `project-${deploymentId}`,
    },

    spec: {

      replicas: 2,

      selector: {

        matchLabels: {
          app:
            projectName.toLowerCase(),
        },
      },

      template: {

        metadata: {

          labels: {
            app:
              projectName.toLowerCase(),
          },
        },

        spec: {

          containers: [

            {
              name:
                projectName.toLowerCase(),

              image:
                `${projectName.toLowerCase()}:latest`,

              ports: [
                {
                  containerPort: 3000,
                },
              ],
            },
          ],
        },
      },
    },
  };

  const service = {

    apiVersion: "v1",

    kind: "Service",

    metadata: {

      name:
        `${projectName.toLowerCase()}-service`,

      namespace:
        `project-${deploymentId}`,
    },

    spec: {

      selector: {
        app:
          projectName.toLowerCase(),
      },

      ports: [

        {
          protocol: "TCP",
          port: 80,
          targetPort: 3000,
        },
      ],

      type: "LoadBalancer",
    },
  };

  const outputDir = path.join(

    __dirname,

    "../../kubernetes",

    deploymentId
  );

  await fs.ensureDir(outputDir);

  await fs.writeFile(

    path.join(
      outputDir,
      "namespace.yaml"
    ),

    YAML.stringify(namespace)
  );

  await fs.writeFile(

    path.join(
      outputDir,
      "deployment.yaml"
    ),

    YAML.stringify(deployment)
  );

  await fs.writeFile(

    path.join(
      outputDir,
      "service.yaml"
    ),

    YAML.stringify(service)
  );

  return outputDir;
};

module.exports = {
  generateK8sFiles,
};
