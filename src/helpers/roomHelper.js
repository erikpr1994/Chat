const rooms = require("../models/roomModel");
const userHelper = require("../helpers/userHelper");

const addNewConnectedUser = async (email, roomId) => {
  if (rooms[roomId]) {
    if (userHelper.getUserFromEmail(email)) {
      if (
        !rooms[roomId].users.find((user) => {
          return user === email;
        })
      )
        rooms[roomId].users.push(userHelper.getUserFromEmail(email).email);
    }
  }
};

const deleteConnectedUser = async (email, roomId) => {
  if (rooms[roomId]) {
    if (userHelper.getUserFromEmail(email)) {
      rooms[roomId].users.filter(
        (user) => user !== userHelper.getUserFromEmail(email).email
      );
    }
  }
};

module.exports = { addNewConnectedUser, deleteConnectedUser };
