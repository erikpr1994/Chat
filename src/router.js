const router = require("express").Router();

const usersController = require("./controllers/userController");
const chatController = require("./controllers/chatController");

router.get("/login", usersController.checkLogin);
router.post("/register", usersController.register);
router.get("/getData", usersController.getData);
router.post("/addFriend", usersController.addFriend);
router.post("/createChat", chatController.createChat);

module.exports = router;
