const http = require("http");
const express = require("express");
const usersRouter = require("./routes/users/usersRouter");
const connectDB = require("./config/database");

//server
const app = express();

//middlewares
app.use(express.json()); //pass incoming data

//db connect
connectDB();

//Routes
app.use("/", usersRouter);

const server = http.createServer(app);

// Starting server

const PORT = process.env.PORT || 9080;
server.listen(PORT, console.log("Listening port: ", PORT));
