const saveData = (data) => {
  const { friends, chats } = data;
  if (friends) saveFriends(friends);
  if (chats) saveChats(chats);
};

const saveFriends = (friends) => {
  localStorage.setItem("friends", JSON.stringify(friends));
};

const getFriends = () => {
  return JSON.parse(localStorage.getItem("friends"));
};

const saveChats = (chats) => {
  localStorage.setItem("chats", JSON.stringify(chats));
};

const getChats = () => {
  return JSON.parse(localStorage.getItem("chats"));
};

const saveLoggedUserId = (id) => {
  localStorage.setItem("loggedUser", id);
};

const getLoggedUserId = () => {
  return localStorage.getItem("loggedUser");
};

const saveLooggedUserEmail = (email) => {
  localStorage.setItem("loggedUserEmail", email);
};

const getLoggedUserEmail = () => {
  return localStorage.getItem("loggedUserEmail");
};

const saveActiveChatId = (chatId) => {
  localStorage.setItem("activeChat", chatId);
};

const getActiveChatId = () => {
  return localStorage.getItem("activeChat");
};

export default {
  saveData,
  getFriends,
  getChats,
  saveLoggedUserId,
  getLoggedUserId,
  saveLooggedUserEmail,
  getLoggedUserEmail,
  saveActiveChatId,
  getActiveChatId,
};
