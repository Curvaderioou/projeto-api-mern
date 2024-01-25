import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  username: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  avatar: {
    type: "string",
    required: true,
  },
  background: {
    type: "string",
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
