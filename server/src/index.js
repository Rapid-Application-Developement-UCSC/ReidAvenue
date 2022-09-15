import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import User from "./models/User.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log(req);
  res.send({
    message: "Hello from express server",
  });
});

app.post("/", (req, res) => {
  console.log(req.body);
  setTimeout(() => {
    res.json("Successfully submitted data");
  }, 2000);
});

mongoose.connect(process.env.MONGO_URL, {}, async (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Successfully connected to MongoDB");
    app.listen(8080, async () => {
      console.log("Server started listening at PORT 3000");
      const user = new User({
        email: "randima@gmail.com",
        firstName: "Randima",
        lastName: "Dias",
        hashedPAssword: "ejhgaujguiegruig",
        username: "RandimaD25",
      });
      await user.save();
    });
  }
});
