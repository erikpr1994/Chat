const database = require("./index");

const userSchema = new database.Schema({
  email: String,
  name: String,
  password: String,
  friends: [],
});

const user = database.model("user", userSchema);

module.exports = user;
