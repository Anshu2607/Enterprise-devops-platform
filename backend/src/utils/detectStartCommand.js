const fs = require("fs");

const path = require("path");

const detectStartCommand = (
  deployPath
) => {

  const packageJsonPath =
    path.join(

      deployPath,

      "package.json"
    );

  if (
    !fs.existsSync(
      packageJsonPath
    )
  ) {

    return [

      "node",

      "index.js",
    ];
  }

  const packageJson =
    JSON.parse(

      fs.readFileSync(
        packageJsonPath,
        "utf-8"
      )
    );

  const scripts =
    packageJson.scripts || {};

  if (scripts.dev) {

    return [

      "npm",

      "run",

      "dev",
    ];
  }

  if (scripts.start) {

    return [

      "npm",

      "run",

      "start",
    ];
  }

  return [

    "node",

    "index.js",
  ];
};

module.exports = {
  detectStartCommand,
};