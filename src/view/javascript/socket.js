import storage from "./localstorage.js";

import chat from "./chat.js";

let socket;

const sendMessage = (e) => {
  e.preventDefault();
  const message = {
    message: document.getElementById("written-message").value,
    loggedUser: storage.getLoggedUserId(),
    chatId: storage.getActiveChatId(),
  };

  if (storage.getActiveChatId()) socket.emit("sendMessage", message);

  document.getElementById("written-message").value = "";
};

const initSocket = () => {
  const loggedUser = storage.getLoggedUserId();
  const data = {
    loggedUser,
  };

  // eslint-disable-next-line no-undef
  socket = io.connect("http://localhost:8000", {
    query: `data=${JSON.stringify(data)}`,
  });

  socket.on("userConnected", async (user) => {
    changeConnectedState(user, true);
  });

  socket.on("userDisconnected", async (user) => {
    changeConnectedState(user, false);
  });

  socket.on("receiveMessage", async (message) => {
    const chats = storage.getChats();
    const updatedChats = chats.map((chat) => {
      if (chat._id === message.chatId) chat.messages.push(message);
    });
    storage.saveData({ chats: updatedChats, friend: null });
  });

  const submitMessage = document.getElementById("send-message");
  submitMessage.addEventListener("submit", sendMessage);
};

const changeConnectedState = (user, state) => {
  if (storage.getLoggedUserId !== user) {
    const friends = storage.getFriends().map((friend) => {
      if (friend.id === user) friend.logged = state;
      return friend;
    });

    storage.saveData({ chats: null, friends });

    if (document.getElementById("forAddFriend")) chat.showContacts();
  }
};

export default initSocket;
