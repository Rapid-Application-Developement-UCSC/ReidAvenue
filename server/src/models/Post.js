import mongoose from "mongoose";
import User from "./User.js";

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    required: true,
  },

  imageId: {
    type: String,
    required: true,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Like",
    },
  ],

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
