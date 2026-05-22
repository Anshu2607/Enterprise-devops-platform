const express = require("express");

const cors = require("cors");

const http = require("http");

const { Server } = require("socket.io");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const projectRoutes = require("./routes/projectRoutes");

const deploymentRoutes = require("./routes/deploymentRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

global.io = io;

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/deploy", deploymentRoutes);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});