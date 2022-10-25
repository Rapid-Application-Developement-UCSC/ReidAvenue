import { Router } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import {
  getJWTToken,
  getRefreshToken,
  isAuthenticated,
} from "../services/auth-service.js";
import { imagekit } from "../imagekit.js";
import mongoose from "mongoose";

const postController = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb
  },
});

postController.get("/", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate("friends");
  let posts = [];

  for (const friendId of user.friends) {
    const friend = await User.findById(friendId);
    console.log(`friend is ${friend.firstName}`);
    let friendPosts = await Post.find({ postedBy: friendId }).sort({
      createdAt: -1,
    });
    friendPosts = friendPosts.map((post) => {
      return {
        _id: post._id,
        createdAt: post.createdAt,
      };
    });
    posts.push(...friendPosts);
  }

  posts = posts.sort((a, b) => b.createdAt - a.createdAt);
  res.json(posts);
});

postController.get("/:id", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId)
    .populate("postedBy")
    .populate("likes");
  res.json(post);
});

postController.get("/my-posts/all", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  let posts = await Post.find({ postedBy: userId }).sort({
    createdAt: -1,
  });

  posts = posts.map((post) => {
    return {
      ...post._doc,
      likes: post.likes.length,
    };
  });
  res.json(posts);
});

postController.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    const userId = req.userId;
    // console.log(userId);
    try {
      const id = mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.log(err);
    }
    const { caption } = req.body;
    const image = req.file;
    const result = await imagekit.upload({
      file: image.buffer,
      fileName: `${userId}-${new Date().toDateString()}-${image.originalname}`,
    });
    const post = await Post.create({
      caption,
      image: result.url,
      postedBy: userId,
      imageId: result.fileId,
    });
    res.status(201).json(post);
  }
);

postController.delete("/:id", isAuthenticated, async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (post.postedBy.toString() === userId) {
    await imagekit.deleteFile(post.imageId);
    await Post.findByIdAndDelete(postId);
    res.status(204).end();
  } else {
    res.status(403).end();
  }
});

export default postController;
