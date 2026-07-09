require("dotenv").config();
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routers/userRouter");
const blogRouter = require("./routers/blogRouter");
const commentRouter = require("./routers/commentRouter");

const { checkForToken } = require("./middlewares/auth");

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongodb connected!"))
  .catch((err) => console.log("Mongodb connection error", err));

//Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.static(path.resolve("./public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(checkForToken);

//Routes
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);

//Error Handler
app.use((err, req, res, next) => {
  res.status(400).json({
    message: err.message || "Something went wrong.",
  });
});

//Listener
app.listen(8000, () => {
  console.log("Server started at Port 8000");
});
