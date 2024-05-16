import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import moment from "moment";

// schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      require: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "Password length should be greater than 6 character "],
      select: true,
    },
    location: {
      type: String,
      default: "India",
    },
    role: {
      type: String,
      enum: ["admin", "recruiter", "applicant"],
      default: "applicant", // Default role for new users
    },
    resetToken: String,
    resetTokenExpiresAt: Date,
  },
  { timestamps: true }
);
// middleware
userSchema.pre("save", async function () {
  if (!this.isModified) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// compare password
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

userSchema.methods.isPasswordResetTokenValid = function (token) {
  return (
    token === this.resetToken && moment().isBefore(this.resetTokenExpiresAt)
  );
};

// JSON WEBTOKEN
userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default mongoose.model("User", userSchema);
