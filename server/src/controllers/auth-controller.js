import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  getJWTToken,
  getRefreshToken,
  isAuthenticated,
} from "../services/auth-service.js";

const authController = Router();

authController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  // checking if the email already exists
  const userExists = await User.findOne({ email });
  console.log(userExists);
  if (!userExists) {
    return res.status(400).json({ message: "User does not exist" });
  } else {
    const doesPasswordMatch = await bcrypt.compare(
      password,
      userExists.hashedPassword
    );
    if (!doesPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      const token = getJWTToken(userExists._id);
      const refreshToken = getRefreshToken(userExists._id);
      // add the refresh token to the user's refresh token array
      userExists.refreshTokens.push(refreshToken);
      await userExists.save();

      // set refresh token as a httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        //set expire in 1 month
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      return res.status(200).json({
        message: "Login successful",
        user: {
          _id: userExists._id,
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          email: userExists.email,
        },
        token,
      });
    }
  }
});

authController.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  // checking if the email already exists
  const userExists = await User.findOne({ email });
  if (!userExists) {
    if (password === confirmPassword) {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        firstName,
        lastName,
        email,
        hashedPassword,
      });
      await newUser.save();
      res.status(201).json("Successfully created new user");
    } else {
      res.status(400).json({ message: "Passwords do not match" });
    }
  } else {
    res.status(400).json({ message: "User already exists" });
  }
});

authController.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // check if the refresh token is valid
  const isTokenValid = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if (!isTokenValid) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // check if the refresh token is present in the user's refresh token array
  const user = await User.findOne({
    refreshTokens: {
      $in: [refreshToken],
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // generate a new access token
  const token = getJWTToken(user._id);
  const newRefreshToken = getRefreshToken(user._id);
  // add the new refresh token to the user's refresh token array
  user.refreshTokens.push(newRefreshToken);
  //delete the old refresh token from the user's refresh token array
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== refreshToken
  );
  await user.save();
  // set refresh token as a httpOnly cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    //set expire in 1 month
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return res.status(200).json({ token });
});

authController.post("/logout", isAuthenticated, async (req, res) => {
  const { refreshToken } = req.cookies;
  const userId = req.userId;
  // get the user
  const user = await User.findById(userId);
  // check if user exists
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // delete the refresh token from the user's refresh token array
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== refreshToken
  );
  await user.save();
  // delete the refresh token cookie
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
});

export default authController;
