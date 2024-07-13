const express = require("express");
const { createPost, getPosts, getPost, updatePost, deletePost } = require("../../controllers/posts/postsController");
const isLoggedIn = require("../../middlewares/isLogged");

const postRouter = express.Router();

//create
postRouter.post("/", isLoggedIn, createPost);
//? all
postRouter.get("/", getPosts);
//? single
postRouter.get("/:id", getPost);
//! delete
postRouter.delete("/:id", isLoggedIn, deletePost);
//* Update
postRouter.put("/:id", isLoggedIn, updatePost);

module.exports = postRouter;
