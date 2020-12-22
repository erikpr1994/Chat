const ChatModel = require("../models/chatModel");

const addNewUserToMultiChat = async (email, chatId) => {
  const chat = await ChatModel.findById(chatId);
  chat.users.push(email);
  await chat.save();
};

const createChat = async (name, users, multichat) => {
  try {
    const chat = new ChatModel({ name, users, multichat });
    const chatCreated = chat.save();
    return chatCreated;
  } catch (e) {
    return false;
  }
};

const getChats = async (userId) => {
  const chats = await ChatModel.find();

  const userChats = chats.filter((chats) => {
    return chats.users.includes(userId);
  });

  return userChats;
};

const saveMessage = async (messageReceived) => {
  const { chatId, message, date, loggedUser } = messageReceived;
  const chat = await ChatModel.findById(chatId);

  const newMessage = { message, date, loggedUser };
  chat.messages.push(newMessage);
  await chat.save();
};

module.exports = { createChat, addNewUserToMultiChat, getChats, saveMessage };
