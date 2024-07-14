const express = require("express");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  ProfileViewers,
} = require("../../controllers/users/usersController");
const isLoggedIn = require("../../middlewares/isLogged");

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/profile", isLoggedIn, getProfile);
usersRouter.get("/block/:userIdToBlock", isLoggedIn, blockUser);
usersRouter.get("/unblock/:unblockedUserId", isLoggedIn, unblockUser);
usersRouter.get("/view/:userProfileId", isLoggedIn, ProfileViewers);

module.exports = usersRouter;
