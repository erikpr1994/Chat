import storage from "./localstorage.js";

import fetchRequest from "./fetch.js";

window.addEventListener("load", (e) => {
  e.preventDefault();
  const createChatButton = document.getElementById("createChat");
  createChatButton.addEventListener("click", () => {
    showContacts();
  });

  showChats();
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
      const div = document.createElement("DIV");

      const name = document.createElement("H3");
      const textName = document.createTextNode(friend.name);
      name.appendChild(textName);
      const email = document.createElement("p");
      const textEmail = document.createTextNode(friend.email);
      email.appendChild(textEmail);

      div.appendChild(name);
      div.appendChild(email);

      node.appendChild(div);
      chatsSection.appendChild(node);

      node.addEventListener("click", () => {
        showChat(friend.id);
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
      const node = document.createElement("ARTICLE");
      const div = document.createElement("DIV");

      const name = document.createElement("H3");
      const textName = document.createTextNode(chat.name);
      name.appendChild(textName);

      const lastMessage = document.createElement("P");
      const textMessage = document.createTextNode(
        chat.messages[chat.messages.length - 1]
      );

      lastMessage.appendChild(textMessage);

      div.appendChild(name);
      div.appendChild(lastMessage);

      node.appendChild(div);
      node.id(chat.id);
      node.addEventListener("click", showChat);
      chatsSection.appendChild(node);
    });
  }
};

const showChat = () => {};
