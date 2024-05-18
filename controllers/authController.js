import cloudinary from "../config/cloudinary.js";
import userModel from "../models/userModel.js";
import { sendNotification } from "../server.js";

export const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;

  let imageUrl = "";
  const image = req.file;

  if (!name) {
    next("name is required");
  }
  if (!email) {
    next("email is required");
  }
  if (!password) {
    next("password is required and greater than 6 character");
  }

  if (image) {
    try {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "user_images",
      });
      imageUrl = result.secure_url;
    } catch (error) {
      fs.unlink(image.path);
      return next("Image upload failed", err);
    }
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    fs.unlink(image.path);
    next("Email Already Registered Please Login");
  }
  const user = await userModel.create({
    name,
    email,
    password,
    image: imageUrl,
  });
  // token
  const token = user.createJWT();
  res.status(201).send({
    success: true,
    message: "User created successfully",
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
      image: user.image,
    },
    token,
  });

  sendNotification(
    user._id.toString(),
    "Welcome! Your account has been created successfully."
  );
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  // validation
  if (!email || !password) {
    return next("Please Provide All Fields");
  }
  // find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next("No User found");
  }

  // compare password
  const isMatch = await user.comparePassword(password);
  user.password = undefined;
  if (!isMatch) {
    return next("Invalid Username or password");
  }

  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};
