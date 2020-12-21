const router = require("express").Router();

const usersController = require("./controllers/userController");

router.get("/login", usersController.checkLogin);
router.post("/register", usersController.register);
router.get("/getData", usersController.getData);
router.post("/addFriend", usersController.addFriend);

module.exports = router;
