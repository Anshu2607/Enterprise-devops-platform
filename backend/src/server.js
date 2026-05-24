require("dotenv").config();

const express = require("express");

const cors = require("cors");

const http = require("http");

const authRoutes = require(
  "./routes/authRoutes"
);

const projectRoutes = require(
  "./routes/projectRoutes"
);

const deploymentRoutes = require(
  "./routes/deploymentRoutes"
);

const deploymentsRoutes = require(
  "./routes/deploymentsRoutes"
);

const manageDeploymentRoutes =
  require(
    "./routes/manageDeploymentRoutes"
  );

const {

  initSocket,

} = require("./socket");

const app = express();

const server =
  http.createServer(app);

// SOCKET.IO

initSocket(server);

// MIDDLEWARES

app.use(cors());

app.use(express.json());

// TEST ROUTE

app.get("/", (req, res) => {

  res.send(
    "Enterprise DevOps Platform API Running"
  );
});

// AUTH ROUTES

app.use(
  "/api/auth",
  authRoutes
);

// PROJECT ROUTES

app.use(
  "/api/projects",
  projectRoutes
);

// DEPLOY ROUTES

app.use(
  "/api/deploy",
  deploymentRoutes
);

// GET DEPLOYMENTS

app.use(
  "/api/deployments",
  deploymentsRoutes
);

// MANAGE DEPLOYMENTS

app.use(
  "/api/manage",
  manageDeploymentRoutes
);

// START SERVER

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});