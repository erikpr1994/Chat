window.addEventListener("load", (e) => {
  e.preventDefault();
  const chat = document.querySelector("#chat");
  console.log(chat);
  const messages = chat.import.querySelector("#messages");
  document
    .querySelector(".main-section")
    .appendChild(document.importNode(messages, true));
});
