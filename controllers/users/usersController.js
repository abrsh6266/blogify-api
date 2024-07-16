const User = require("../../model/User/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");
const expressAsyncHandler = require("express-async-handler");
const sendEmail = require("../../utils/sendEmail");
const sendAccVerificationEmail = require("../../utils/sendAccountVerificationEmail");

exports.register = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  //check user exists
  const user = await User.findOne({
    username,
  });
  if (user) {
    throw new Error("user Already exists");
  }
  const newUser = new User({
    username,
    email,
    password,
  });

  //hashing password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);
  //save
  await newUser.save();

  res.status(201).json({
    status: "success",
    message: "user registered successfully",
    user: { _id: newUser?._id, username, email },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Login Credentials");
  }

  //compare password

  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch) {
    throw new Error("Password doesn't match");
  }

  //update last login activity
  user.lastLogin = new Date();

  res.status(200).json({
    status: "failed",
    message: "logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email,
      role: user.role,
    },
    token: generateToken(user),
  });
});

exports.getProfile = asyncHandler(async (req, res, next) => {
  const id = req.user._id;

  const user = await User.findById(id)
    .populate({
      path: "posts",
      model: "Post",
    })
    .populate({
      path: "following",
      model: "User",
    })
    .populate({
      path: "followers",
      model: "User",
    })
    .populate({
      path: "blockedUsers",
      model: "User",
    })
    .populate({
      path: "ProfileViewers",
      model: "User",
    });
  res.status(200).json({
    status: "success",
    message: "profile fetched",
    user,
  });
});

//block user

exports.blockUser = asyncHandler(async (req, res) => {
  const userProfileId = req.params.userProfileId;
  const userId = req.user?.id;

  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    throw new Error("User not found to block");
  }

  //check not him self
  if (userProfileId.toString() === userId.toString()) {
    throw new Error("cannot block yourself");
  }

  const currentUser = await User.findById(userId);
  //check if the user is blocked
  if (currentUser?.blockedUsers?.includes(userProfileId)) {
    throw new Error("User alrready blocked");
  }

  //push user to be blocked

  currentUser?.blockedUsers.push(userProfileId);

  await currentUser.save();
  res.json({
    status: "success",
    message: "blocked successfully",
  });
});

//unblock user

exports.unblockUser = asyncHandler(async (req, res) => {
  const unblockedUserId = req.params.unblockedUserId;
  //finding unblocked user

  const unblockedUser = await User.findById(unblockedUserId);
  if (!unblockedUser) {
    throw new Error("User not found");
  }
  const currentUser = await User.findById(req?.user?._id);
  if (!currentUser.blockedUsers.includes(unblockedUserId)) {
    throw new Error("user not blocked");
  }
  currentUser.blockedUsers = currentUser.blockedUsers.filter(
    (id) => id.toString() !== unblockedUserId.toString()
  );
  //save
  await currentUser.save();
  res.json({
    status: "success",
    message: "User successfully unblocked",
  });
});

//user profile viewer

exports.ProfileViewers = asyncHandler(async (req, res) => {
  const userProfileId = req.params.userProfileId;
  const userId = req.user?.id;

  const userProfile = await User.findById(userProfileId);
  if (!userProfile) {
    throw new Error("User not found to view");
  }

  const currentUser = await User.findById(userId);
  //check if the user is blocked
  if (userProfile?.profileViewers?.includes(userId)) {
    throw new Error("User alrready viewed");
  }

  //push user to be blocked

  userProfile?.profileViewers.push(userProfileId);

  await userProfile.save();
  res.json({
    status: "success",
    message: "viewed successfully",
  });
});

exports.followingUser = asyncHandler(async (req, res) => {
  //Find the current user
  const currentUserId = req.user._id;
  //! Find the user to follow
  const userToFollowId = req.params.userToFollowId;
  //Avoid user following himself
  if (currentUserId.toString() === userToFollowId.toString()) {
    throw new Error("You cannot follow yourself");
  }
  //Push the usertofolowID into the current user following field
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $addToSet: { following: userToFollowId },
    },
    {
      new: true,
    }
  );
  //Push the currentUserId into the user to follow followers field
  await User.findByIdAndUpdate(
    userToFollowId,
    {
      $addToSet: { followers: currentUserId },
    },
    {
      new: true,
    }
  );
  //send the response
  res.json({
    status: "success",
    message: "You have followed the user successfully",
  });
});

exports.unFollowingUser = asyncHandler(async (req, res) => {
  //Find the current user
  const currentUserId = req.user._id;
  //! Find the user to unfollow
  const userToUnFollowId = req.params.userToUnFollowId;

  //Avoid user unfollowing himself
  if (currentUserId.toString() === userToUnFollowId.toString()) {
    throw new Error("You cannot unfollow yourself");
  }
  //Remove the usertoUnffolowID from the current user following field
  await User.findByIdAndUpdate(
    currentUserId,
    {
      $pull: { following: userToUnFollowId },
    },
    {
      new: true,
    }
  );
  //Remove the currentUserId from the user to unfollow followers field
  await User.findByIdAndUpdate(
    userToUnFollowId,
    {
      $pull: { followers: currentUserId },
    },
    {
      new: true,
    }
  );
  //send the response
  res.json({
    status: "success",
    message: "You have unfollowed the user successfully",
  });
});

exports.forgotPassword = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  //Find the email in our db
  const userFound = await User.findOne({ email });
  if (!userFound) {
    throw new Error("There's No Email In Our System");
  }
  //Create token
  const resetToken = await userFound.generatePasswordResetToken();
  //resave the user
  await userFound.save();

  //send email
  sendEmail(email, resetToken);
  res.status(200).json({ message: "Password reset email sent", resetToken });
});

exports.resetPassword = expressAsyncHandler(async (req, res) => {
  //Get the id/token from email /params
  const { resetToken } = req.params;
  const { password } = req.body;
  //Convert the token to actual token that has been saved in the db
  const cryptoToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //find the user by the crypto token
  const userFound = await User.findOne({
    passwordResetToken: cryptoToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!userFound) {
    throw new Error("Password reset token is invalid or has expired");
  }
  //Update the user password
  const salt = await bcrypt.genSalt(10);
  userFound.password = await bcrypt.hash(password, salt);
  userFound.passwordResetExpires = undefined;
  userFound.passwordResetToken = undefined;
  //resave the user
  await userFound.save();
  res.status(200).json({ message: "Password reset successfully" });
});

exports.accountVerificationEmail = expressAsyncHandler(async (req, res) => {
  //Find the login user email
  const user = await User.findById(req?.user?._id);
  if (!user) {
    throw new Error("User not found");
  }
  //send the token
  const token = await user.generateAccVerificationToken();
  //resave
  await user.save();
  //send the email
  sendAccVerificationEmail(user?.email, token);
  res.status(200).json({
    message: `Account verification email sent ${user?.email}`,
  });
});

exports.verifyAccount = expressAsyncHandler(async (req, res) => {
  //Get the id/token params
  const { verifyToken } = req.params;
  //Convert the token to actual token that has been saved in the db
  const cryptoToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");
  //find the user by the crypto token
  const userFound = await User.findOne({
    accountVerificationToken: cryptoToken,
    accountVerificationExpires: { $gt: Date.now() },
  });
  if (!userFound) {
    throw new Error("Account verification  token is invalid or has expired");
  }
  //Update user account
  userFound.isVerified = true;
  userFound.accountVerificationExpires = undefined;
  userFound.accountVerificationToken = undefined;
  //resave the user
  await userFound.save();
  res.status(200).json({ message: "Account successfully verified" });
});
