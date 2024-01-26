import mongoose from "mongoose";
import bcrypt from "bcrypt";

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: Array,
    required: true,
  },
  coments: {
    type: Array,
    required: true,
  },
});
// NewsSchema.pre("save", async function (next) {
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });
const News = mongoose.model("News", NewsSchema);

export default News;
