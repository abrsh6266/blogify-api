const User = require("../../model/User/User");

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
