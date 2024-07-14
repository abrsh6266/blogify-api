const User = require("../../model/User/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");
const asyncHandler = require("express-async-handler");

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

  const user = await User.findById(id);
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
