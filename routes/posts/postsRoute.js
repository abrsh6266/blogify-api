const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  disLikePost,
} = require("../../controllers/posts/postsController");
const isLoggedIn = require("../../middlewares/isLogged");
const checkAccountVerification = require("../../middlewares/isAccountVerified");

const postRouter = express.Router();

//create
postRouter.post("/", isLoggedIn, checkAccountVerification, createPost);
//? all
postRouter.get("/", getPosts);
//? single
postRouter.get("/:id", getPost);
//! delete
postRouter.delete("/:id", isLoggedIn, deletePost);
//* Update
postRouter.put("/:id", isLoggedIn, updatePost);

postRouter.put("/likes/:id", isLoggedIn, likePost);
postRouter.put("/dislikes/:id", isLoggedIn, disLikePost);

module.exports = postRouter;
