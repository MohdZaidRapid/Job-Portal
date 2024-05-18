import mongoose from "mongoose";
const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, required: true },
  comment: { type: String },
});

export default mongoose.model("FeedBack", feedbackSchema);
