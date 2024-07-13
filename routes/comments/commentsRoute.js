const express = require("express");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../../controllers/comments/commentsController");
const isLoggedIn = require("../../middlewares/isLogged");

const commentRouter = express.Router();

//create
commentRouter.post("/:id", isLoggedIn, createComment);

// ! delete
commentRouter.delete("/:id", isLoggedIn, deleteComment);

// * Update
commentRouter.put("/:id", isLoggedIn, updateComment);

module.exports = commentRouter;
