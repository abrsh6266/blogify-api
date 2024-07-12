require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../model/User/User");

const isLoggedIn = (req, res, next) => {
  //get token
  const token = req.headers.authorization?.split(" ")[1];

  jwt.verify(token, process.env.TOKENKEY, async (err, decoded) => {
    const userId = decoded?.user?.id;

    const user = await User.findById(userId).select("_id username email role");
    req.user = user;
    if (err) {
      const error = new Error("Expired/Invalid Token");
      next(error);
    } else {
      next();
    }
  });
};

module.exports = isLoggedIn;
