const express = require("express");
const {
  register,
  login,
  getProfile,
  blockUser,
  unblockUser,
  ProfileViewers,
  followingUser,
  unFollowingUser,
} = require("../../controllers/users/usersController");
const isLoggedIn = require("../../middlewares/isLogged");

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/profile", isLoggedIn, getProfile);
usersRouter.put("/block/:userIdToBlock", isLoggedIn, blockUser);
usersRouter.put("/unblock/:unblockedUserId", isLoggedIn, unblockUser);
usersRouter.get("/view/:userProfileId", isLoggedIn, ProfileViewers);
usersRouter.put("/following/:userToFollowId", isLoggedIn, followingUser);
usersRouter.put("/unfollowing/:userToFollowId", isLoggedIn, unFollowingUser);

module.exports = usersRouter;
