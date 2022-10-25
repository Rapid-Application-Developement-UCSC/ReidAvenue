import { Router } from "express";
import User from "../models/User.js";
import { isAuthenticated } from "../services/auth-service.js";

const friendController = Router();

friendController.get("/", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate("friends");
  res.json(user.friends);
});

friendController.get("/:userFirstName", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  // search for users with firstName that matches the userFirstName param when lowercase
  const users = await User.find({
    firstName: { $regex: req.params.userFirstName, $options: "i" },
  });
  // filter out the current user
  const filteredUsers = users.filter((user) => user._id != userId);
  res.json(filteredUsers);
});

friendController.patch("/:id", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  const friendId = req.params.id;
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (!user.friends.includes(friendId)) {
    user.friends.push(friendId);
    friend.friends.push(userId);
  } else {
    return res
      .status(400)
      .json({ message: "You are already friends with this user." });
  }
  await user.save();
  await friend.save();
  res.status(200).json(user);
});

friendController.delete("/:id", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  const friendId = req.params.id;
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((friend) => friend != friendId);
    friend.friends = friend.friends.filter((friend) => friend != userId);
  }
  await user.save();
  await friend.save();
  res.status(200).json(user);
});

export default friendController;
