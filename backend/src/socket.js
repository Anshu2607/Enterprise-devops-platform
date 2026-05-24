let io = null;

const initSocket = (server) => {

  const socketIo =
    require("socket.io");

  io = socketIo(server, {

    cors: {
      origin: "*",
    },
  });

  console.log(
    "Socket.IO initialized"
  );

  return io;
};

const getIO = () => {

  return io;
};

module.exports = {

  initSocket,

  getIO,
};