const http = require("http");
const socket = require("socket.io");
const config = require("./config");

const chatHelper = require("./helpers/chatHelper");

module.exports = function () {
  const server = http
    .createServer()
    .listen(config.webservicePort, config.hostname);

  const io = socket(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    const { data } = socket.request._query;
    const { loggedUser } = JSON.parse(data);

    socket.broadcast.emit("userConnected", loggedUser);

    socket.on("sendMessage", (message) => {
      message.date = new Date();
      chatHelper.saveMessage(message);
      socket.broadcast.emit("receiveMessage", message);
    });

    socket.on("disconnect", function () {
      socket.broadcast.emit("userDisconnected", loggedUser);
    });
  });
};
