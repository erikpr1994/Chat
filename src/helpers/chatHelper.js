const ChatModel = require("../models/chatModel");

const addNewUserToMultiChat = async (email, chatId) => {
  const chat = await ChatModel.findById(chatId);
  chat.users.push(email);
  await chat.save();
};

const createChat = async (name, users, multichat) => {
  const chat = new ChatModel({ name, users, multichat });
  chat.save();
};

const getChats = async (userId) => {
  const chats = await ChatModel.find();

  const userChats = chats.filter((chats) => {
    return chats.users.includes(userId);
  });

  return userChats;
};

module.exports = { createChat, addNewUserToMultiChat, getChats };
