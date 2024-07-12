require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  //creating payload

  const payload = {
    user: {
      id: user._id,
    },
  };

  // sign the token with the secrete key
  const token = jwt.sign(payload, process.env.TOKENKEY, {
    expiresIn: 36000, //1hr
  });
  return token;
};

module.exports = generateToken;
