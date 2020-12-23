const database = require("./index");
const chat = database.model("chat", {
  users: [],
  multichat: Boolean,
  name: String,
  messages: [],
  blockedUsers: [],
  img: String,
});

module.exports = chat;
