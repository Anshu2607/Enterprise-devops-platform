const fs = require("fs");

const path = require("path");

const generateK8sYaml = (

  deploymentId,

  imageName,

  port

) => {

  console.log(
    "Generating Kubernetes YAML..."
  );

  const yaml = `

apiVersion: apps/v1
kind: Deployment

metadata:
  name: ${deploymentId}

spec:
  replicas: 1

  selector:
    matchLabels:
      app: ${deploymentId}

  template:
    metadata:
      labels:
        app: ${deploymentId}

    spec:
      containers:
        - name: ${deploymentId}
          image: ${imageName}

          ports:
            - containerPort: 3000

---

apiVersion: v1
kind: Service

metadata:
  name: ${deploymentId}-service

spec:
  selector:
    app: ${deploymentId}

  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000

  type: NodePort
`;

  const outputPath =
    path.join(

      __dirname,

      "../../k8s",

      `${deploymentId}.yaml`
    );

  console.log(
    "Saving YAML to:",
    outputPath
  );

  fs.writeFileSync(
    outputPath,
    yaml
  );

  console.log(
    "YAML generated successfully"
  );

  return outputPath;
};

module.exports = {
  generateK8sYaml,
};