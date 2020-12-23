const user = require("../models/userModel");
const userModel = require("../models/userModel");

const getUserByEmail = async (email) => {
  return await userModel.find({ email }, (err, res) => {
    if (err) return err;
    return res;
  });
};

const getUserById = async (id) => {
  return await userModel.findById(id, (err, res) => {
    if (err) return err;
    return res;
  });
};

const checkIfUserExists = async (email) => {
  const result = await userModel.find({ email }, (err, res) => {
    if (err) return err;
  });

  if (result.length !== 0) return true;
  else return false;
};

const addFriend = async (email) => {
  return await userModel.find({ email }, (err, res) => {
    if (err) return err;
    return res.length === 1 ? res[0] : false;
  });
};

const getFriends = async (friends) => {
  const users = await userModel.find();
  let realFriends = users.filter(({ id } = user._id) => {
    if (friends.includes(id)) return id;
  });

  realFriends = realFriends.map((user) => {
    return { id: user._id, name: user.name, email: user.email };
  });

  return realFriends;
};

module.exports = {
  getUserByEmail,
  getUserById,
  checkIfUserExists,
  addFriend,
  getFriends,
};
