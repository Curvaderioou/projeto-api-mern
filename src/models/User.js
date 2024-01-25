import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    lowercase: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
    select: false,
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
UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model("User", UserSchema);

export default User;
