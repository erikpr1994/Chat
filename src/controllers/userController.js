const UserModel = require("../models/userModel");
const config = require("../config");
const userHelper = require("../helpers/userHelper");
const chatHelper = require("../helpers/chatHelper");

const checkLogin = async (req, res) => {
  const reqURL = new URL(`http://${config.hostname}${req.url}`);

  const email = reqURL.searchParams.get("email");
  const password = reqURL.searchParams.get("password");

  const user = (await userHelper.getUserByEmail(email))[0];

  if (user && user.password === password) {
    res.statusCode = 200;
    res.json({ id: user._id });
  } else {
    res.statusCode = 404;
    res.end("The user or the password are not correct");
  }
};

const register = async (req, res) => {
  const { email, password, name } = req.body;
  const user = new UserModel({ email, password, name });

  const exists = await userHelper.checkIfUserExists(email);

  if (!exists) {
    const newUser = await user.save(user);
    const newUserId = newUser._id;
    res.statusCode = 201;
    res.end(JSON.stringify(newUserId));
  } else {
    res.status(404).send({ message: "El usuario ya existe" });
  }
};

const getData = async (req, res) => {
  const reqURL = new URL(`http://${config.hostname}${req.url}`);
  const email = reqURL.searchParams.get("email");

  const user = await userHelper.getUserByEmail(email);

  let friends;

  user[0] ? (friends = user[0].friends) : (friends = []);

  let friendsToSend = [];
  if (friends) friendsToSend = await userHelper.getFriends(friends);

  let chats;
  user[0] ? (chats = await chatHelper.getChats(user[0]._id)) : (chats = []);

  console.log(`friendsToSend is ${friendsToSend}`);

  res.json({ friends: friendsToSend, chats }).status(200);
};

const addFriend = async (req, res) => {
  try {
    const { email, loggedUser } = req.body;

    if (userHelper.checkIfUserExists(email)) {
      const user = await userHelper.getUserById(loggedUser);
      const newFriend = await userHelper.getUserByEmail(email);

      if (newFriend.length === 0)
        res.status(404).send({ message: "El usuario no existe" });
      else if (user.friends.includes(newFriend[0]._id)) {
        res.statusCode = 404;
        res.send({
          message: "El usuario ya está añadido a tu lista de amigos",
        });
      } else {
        user.friends.push(newFriend[0]._id);
        user.save();
        res.statusCode = 201;
        res.end("Usuario añadido correctamente");
      }
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { checkLogin, register, getData, addFriend };
