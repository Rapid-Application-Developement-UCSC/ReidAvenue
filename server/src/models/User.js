import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },

  //field to store valid refresh tokens as an array
  refreshTokens: {
    type: [String],
    defualt: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
