import storage from "./localstorage.js";

import chatFunctions from "./chat.js";

let socket;

const sendMessage = (e) => {
  e.preventDefault();
  const activeChatId = storage.getActiveChatId();
  if (activeChatId !== "null") {
    const message = {
      date: new Date(),
      message: document.getElementById("written-message").value,
      loggedUser: storage.getLoggedUserId(),
      chatId: storage.getActiveChatId(),
    };

    socket.emit("sendMessage", message);

    document.getElementById("written-message").value = "";
    const chats = storage.getChats();
    const searchedChat =
      chats[chats.findIndex((chat) => chat._id === activeChatId)];
    searchedChat.messages.push(message);
    chats[chats.findIndex((chat) => chat._id === activeChatId)] = searchedChat;
    storage.saveData({ friends: null, chats });
    chatFunctions.showMessages(searchedChat.messages);
  } else {
    alert("No hay ningún chat abierto");
  }
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
    let messageToShow;
    const chats = storage.getChats();
    const updatedChats = chats.map((chat) => {
      if (chat._id === message.chatId) {
        chat.messages.push(message);
        if (storage.getActiveChatId() === chat._id)
          messageToShow = chat.messages;
      }
      return chat;
    });

    storage.saveData({ chats: updatedChats, friend: null });
    chatFunctions.showMessages(messageToShow);
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

    if (document.getElementById("forAddFriend")) chatFunctions.showContacts();
  }
};

export default initSocket;
