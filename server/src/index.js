import dotenv from "dotenv";
dotenv.config();

import fs from "fs";

// importing required modules
import https from "https";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

//importing imagekit to initialize
import "./imagekit.js";

// importing controllers
import authController from "./controllers/auth-controller.js";
import postController from "./controllers/post-controller.js";
import friendController from "./controllers/friend-controller.js";
import notificationsController from "./controllers/notification-controller.js";
import collectionsController from "./controllers/collections-controller.js";

// reading certificate and key files
const key = fs.readFileSync("./key.pem");
const cert = fs.readFileSync("./cert.pem");

// constructing the express app
const app = express();
const server = https.createServer({ key: key, cert: cert }, app);

// setting up cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// setup cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// accept json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting up the routes
app.use("/auth", authController);
app.use("/posts", postController);
app.use("/friends", friendController);
app.use("/notifications", notificationsController);
app.use("/collections", collectionsController);

const PORT = process.env.PORT || 5000;

// connecting to the database
mongoose.connect(process.env.MONGO_URL, {}, async (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Successfully connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server started listening at PORT ${PORT}`);
    });
  }
});
