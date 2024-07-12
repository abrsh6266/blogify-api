const { default: mongoose } = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DBCONNECTION);
    console.log("database has been connected");
  } catch (error) {
    console.log("Database connection failed", error.message);
  }
};

module.exports = connectDB;