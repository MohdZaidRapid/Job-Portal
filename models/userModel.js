import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import moment from "moment";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password length should be greater than 6 characters"],
      select: true,
    },
    location: {
      type: String,
      default: "India",
    },
    role: {
      type: String,
      enum: ["admin", "recruiter", "applicant"],
      default: "applicant",
    },
    resetToken: String,
    resetTokenExpiresAt: Date,
    image: {
      type: String, // URL to the image stored in Cloudinary
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.isPasswordResetTokenValid = function (token) {
  return (
    token === this.resetToken && moment().isBefore(this.resetTokenExpiresAt)
  );
};

userSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken = resetToken;
  this.resetTokenExpiresAt = moment().add(1, "hour").toDate();
  return resetToken;
};

export default mongoose.model("User", userSchema);
