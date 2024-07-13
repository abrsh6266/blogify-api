const express = require("express");
const { createPost } = require("../../controllers/posts/postsController");
const isLoggedIn = require("../../middlewares/isLogged");

const postRouter = express.Router();

//create
postRouter.post("/", isLoggedIn, createPost);
// //?all
// postRouter.get("/", getPosts);
// // ! delete
// postRouter.delete("/:id", isLoggedIn, deletePost);
// // * Update
// postRouter.put("/:id", isLoggedIn, updatePost);

module.exports = postRouter;
