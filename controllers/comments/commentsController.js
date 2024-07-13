const asyncHandler = require("express-async-handler");
const Comment = require("../../model/Comment/comment");
const Post = require("../../model/Post/Post");

exports.createComment = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const postId = req?.params.id;
  //create comment

  const comment = await Comment.create({
    message,
    author: req?.user._id,
    postId,
  });

  //adding comments into posts

  await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: comment._id,
      },
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "comment created successfully",
    comment,
  });
});

exports.updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      message: req.body.message,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: "success",
    message: "Comment successfully updated",
    comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.status(201).json({
    status: "success",
    message: "Comment successfully deleted",
  });
});
