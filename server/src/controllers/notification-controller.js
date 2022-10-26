import { Router } from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { isAuthenticated } from "../services/auth-service.js";
import mongoose from "mongoose";
import AppNotification from "../models/Notification.js";

const notificationsController = Router();

notificationsController.patch(
  "/add/:postId",
  isAuthenticated,
  async (req, res) => {
    const userId = req.userId;
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    // user who posted the post
    const receivedUser = await User.findById(post.postedBy);
    const sentUser = await User.findById(userId);
    const notification = new AppNotification({
      sender: userId,
      receiver: receivedUser._id,
      text: `${sentUser.firstName} ${sentUser.lastName} liked your post "${post.caption}"`,
    });
    await notification.save();
    res.json(notification);
  }
);

notificationsController.delete("/:id", isAuthenticated, async (req, res) => {
  const notificationId = req.params.id;
  await AppNotification.findByIdAndDelete(notificationId);
  res.json({ message: "success" });
});

notificationsController.get("/", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  const notifications = await AppNotification.find({
    receiver: userId,
  }).populate("sender");
  res.json(notifications);
});

export default notificationsController;
