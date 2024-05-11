import mongoose from "mongoose";

// schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
  },
  email: {
    type: String,
    require: [true, "Email is required"],
    unique: true,
  },
  
});

export default mongoose.model("User", userSchema);
