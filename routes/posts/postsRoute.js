const multer = require("multer");
const express = require("express");
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  disLikePost,
  claps,
  schedule,
} = require("../../controllers/posts/postsController");
const isLoggedIn = require("../../middlewares/isLogged");
const checkAccountVerification = require("../../middlewares/isAccountVerified");
const storage = require("../../utils/fileUpload");

const upload = multer({ storage });
const postRouter = express.Router();

//create
postRouter.post("/", isLoggedIn, upload.single("file"), createPost);
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
postRouter.put("/claps/:id", isLoggedIn, claps);
postRouter.put("/schedule/:postId", isLoggedIn, schedule);

module.exports = postRouter;
