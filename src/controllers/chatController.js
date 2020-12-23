const chatHelper = require("../helpers/chatHelper");

const createChat = async (req, res) => {
  const { users, name } = req.body;
  const multichat = false;

  const chatCreated = await chatHelper.createChat(name, users, multichat);

  if (chatCreated) {
    res.statusCode = 201;
    res.end("Chat añadido correctamente");
  } else {
    res.statusCode = 404;
    res.end("Error al crear chat");
  }
};

module.exports = { createChat };
