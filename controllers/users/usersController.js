const User = require("../../model/User/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

exports.register = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(401).json({
      status: "failed",
      message: error?.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error?.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "profile fetched",
      data: req?.user,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error?.message,
    });
  }
};
