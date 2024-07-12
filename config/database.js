const { default: mongoose } = require("mongoose");

const connectDB = async () => {
  try {
    const connected = mongoose.connect(
      "mongodb+srv://Abrsh:abrsha159753@task-manager.yedy7op.mongodb.net/?retryWrites=true&w=majority&appName=Task-manager"
    );
    console.log("database has been connected");
  } catch (error) {
    console.log("Database connection failed", error.message);
  }
};

module.exports = connectDB;
