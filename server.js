const http = require("http");
const express = require("express");
const usersRouter = require("./routes/users/usersRouter");
const connectDB = require("./config/database");
const {
  notFoundHandler,
  globalErroHandler,
} = require("./config/globalErrorHandler");

//server
const app = express();

//middlewares
app.use(express.json()); //pass incoming data

//db connect
connectDB();

//Routes
app.use("/api/v1/users", usersRouter);

//not found middleware(404)
app.use(notFoundHandler());

//Error middlewares
app.use(globalErroHandler);
const server = http.createServer(app);

// Starting server

const PORT = process.env.PORT || 9080;
server.listen(PORT, console.log("Listening port: ", PORT));
