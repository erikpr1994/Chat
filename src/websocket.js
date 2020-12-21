const http = require("http");
const socket = require("socket.io");
const config = require("./config");

const {
  addNewConnectedUser,
  deleteConnectedUser,
} = require("./helpers/chatHelper");

module.exports = function () {
  const server = http
    .createServer()
    .listen(config.webservicePort, config.hostname);

  const io = socket(server, { cors: { origin: "*" } });

  module.exports = io;

  io.on("connection", (socket) => {
    const { data } = socket.request._query;

    const { user, room } = JSON.parse(data);

    addNewConnectedUser(user, room);

    socket.broadcast.emit("changeInUsers");

    socket.on("message", (message) => {
      // Mandamos el mensaje a todos los usuarios a la escucha
      socket.broadcast.emit("message", message);
    });

    socket.on("disconnect", function () {
      deleteConnectedUser(user, room);
      socket.broadcast.emit("changeInUsers");
    });
  });
};
