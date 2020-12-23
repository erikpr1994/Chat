import storage from "./localstorage.js";

import fetchRequest from "./fetch.js";

import initSocket from "./socket.js";

window.addEventListener("load", (e) => {
  e.preventDefault();
  const createChatButton = document.getElementById("chats-list");
  createChatButton.addEventListener("click", () => {
    showContacts();
  });

  const showChatsLists = document.getElementById("users-list");
  showChatsLists.addEventListener("click", () => {
    showChats();
  });

  showChats();

  initChat();

  initSocket();
});

const showContacts = () => {
  const chatsSection = document.getElementById("chat-section");

  while (chatsSection.firstChild)
    chatsSection.removeChild(chatsSection.firstChild);

  const friends = storage.getFriends();

  if (friends && friends.length > 0) {
    friends.forEach((friend) => {
      const node = document.createElement("ARTICLE");
      node.className = "open-chat add-friend";
      node.id = "forAddFriend";
      const div = document.createElement("DIV");

      const name = document.createElement("H3");
      const textName = document.createTextNode(friend.name);
      name.appendChild(textName);
      const email = document.createElement("p");
      const textEmail = document.createTextNode(friend.email);
      email.appendChild(textEmail);
      const logged = document.createElement("p");
      const loggedText = document.createTextNode(
        friend.logged ? "Conectado" : "desconectado"
      );

      logged.appendChild(loggedText);
      logged.className = `state ${friend.logged ? "connect" : "disconnect"}`;

      div.id = friend.id;
      div.appendChild(name);
      div.appendChild(email);
      div.appendChild(logged);

      node.appendChild(div);
      chatsSection.appendChild(node);

      node.addEventListener("click", () => {
        showChat(null, friend.id);
      });
    });
  }

  const node = document.createElement("article");
  node.className = "open-chat add-friend";
  const textNode = document.createElement("P");
  const text = document.createTextNode("Añadir nuevo amigo");

  textNode.appendChild(text);

  node.id = "create-chat";

  node.appendChild(textNode);
  chatsSection.appendChild(node);

  node.addEventListener("click", addForm);
};

const baseURL = "http://localhost:3000/";

const addForm = () => {
  const node = document.getElementById("create-chat");
  node.removeChild(node.firstChild);
  node.removeEventListener("click", addForm);

  const form = document.createElement("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("newEmail").value;

    const url = new URL(`${baseURL}addFriend`);

    const result = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        loggedUser: storage.getLoggedUserId(),
      }),
    });

    if (result.status === 201) {
      await fetchRequest.getUserData(storage.getLoggedUserEmail());
      showContacts();
    } else {
      const res = await result.json();
      alert(res.message);
    }
  });

  const input = document.createElement("input");
  input.id = "newEmail";
  form.appendChild(input);
  node.appendChild(form);
};

const showChats = () => {
  const chatsSection = document.getElementById("chat-section");

  while (chatsSection.firstChild)
    chatsSection.removeChild(chatsSection.firstChild);

  const chats = storage.getChats();

  if (chats && chats.length > 0) {
    chats.forEach((chat) => {
      const node = document.createElement("article");
      node.className = "open-chat";
      const div = document.createElement("div");
      div.className = "message-data";

      const img = document.createElement("img");
      img.src = "../img/profile.png";
      img.className = "chat-img";

      const name = document.createElement("H3");

      const friendId = chat.users.filter((user) => {
        if (user !== storage.getLoggedUserId()) return user;
      });

      const friendName = storage.getFriends().filter((friend) => {
        if (friend.id === friendId[0]) return friend;
      });

      const textName = document.createTextNode(
        `chat con ${
          friendName.length > 0
            ? `${friendName[0].name}`
            : `Usuario desconocido`
        }`
      );
      name.appendChild(textName);

      const lastMessage = document.createElement("P");

      const textMessage = document.createTextNode(
        chat.messages.length > 0
          ? `Ultimo mensaje: ${chat.messages[chat.messages.length - 1].message}`
          : "No hay mensajes aún"
      );

      lastMessage.appendChild(textMessage);

      node.appendChild(img);
      div.appendChild(name);
      div.appendChild(lastMessage);

      node.appendChild(div);
      node.id = `${chat._id}`;
      node.addEventListener("click", () => {
        showChat(chat._id);
      });
      chatsSection.appendChild(node);
    });
  }
};

const showChat = (chatId, friendId) => {
  const openChats = storage.getChats();

  if (openChats.length > 0)
    openChats.some((chat) => {
      if (chat._id === chatId || chat.users.includes(friendId)) {
        storage.saveActiveChatId(chatId);
        showChats();
        showMessages(chat.messages);
        return true;
      }
    });
  else createChat(friendId);
};

const showMessages = (messages) => {
  const sortedMessages = messages.sort((a, b) => {
    return a.date - b.date;
  });

  const messageContainer = document.getElementById("messages-container");

  while (messageContainer.firstChild)
    messageContainer.removeChild(messageContainer.firstChild);

  const me = storage.getLoggedUserId();

  sortedMessages.forEach((message) => {
    const div = document.createElement("div");
    const pre = document.createElement("pre");
    const text = document.createTextNode(message.message);
    if (message.loggedUser === me) {
      div.className = "message-container mine";
      pre.className = "message message-mine";
    } else {
      div.className = "message-container other";
      pre.className = "message";
    }

    pre.appendChild(text);
    div.appendChild(pre);
    messageContainer.appendChild(div);
  });
  messageContainer.appendChild(document.createElement("br"));

  messageContainer.scrollTop = messageContainer.scrollHeight;

  showChats();
};

const createChat = async (friendId) => {
  const url = new URL(`${baseURL}createChat`);

  const actualUserId = storage.getLoggedUserId();

  const result = await fetch(url, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      users: [friendId, actualUserId],
      name: `${friendId}${actualUserId}`,
    }),
  });

  if (result.status === 201) {
    await fetchRequest.getUserData(storage.getLoggedUserEmail());
    showChat(null, friendId);
  }
};

const initChat = () => {
  const messagesContainer = document.getElementById("messages-container");
  while (messagesContainer.firstChild) {
    messagesContainer.removeChild(messagesContainer.firstChild);
  }

  const node = document.createElement("div");
  node.className = "no-message";

  const data = document.createElement("h3");
  const text = document.createTextNode("No hay ningún chat abierto");
  storage.saveActiveChatId(null);

  data.appendChild(text);
  node.appendChild(data);

  messagesContainer.appendChild(node);
};

export default {
  showContacts,
  showMessages,
};
