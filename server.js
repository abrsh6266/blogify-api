const http = require("http");
const express = require("express");
const usersRouter = require("./routes/users/usersRouter");
const connectDB = require("./config/database");
const { globalErrHandler, notFound } = require("./middlewares/globalErrorHandler");
const categoryRouter = require("./routes/categories/categoriesRoutes");
const postRouter = require("./routes/posts/postsRoute");
const commentRouter = require("./routes/comments/commentsRoute");

//server
const app = express();

//middlewares
app.use(express.json()); //pass incoming data

//db connect
connectDB();

//Routes
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories",categoryRouter)
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/comments",commentRouter)

//not found middleware(404)
app.use(notFound);

//Error middlewares
app.use(globalErrHandler);
const server = http.createServer(app);

// Starting server

const PORT = process.env.PORT || 9080;
server.listen(PORT, console.log("Listening port: ", PORT));
