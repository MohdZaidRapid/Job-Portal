import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) {
    next("name is required");
  }
  if (!email) {
    next("email is required");
  }
  if (!password) {
    next("password is required and greater than 6 character");
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    next("Email Already Registered Please Login");
  }
  const user = await userModel.create({ name, email, password });
  // token
  const token = user.createJWT();
  res.status(201).send({
    success: true,
    message: "User created successfully",
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
    },
    token,
  });
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  // validation
  if (!email || !password) {
    next("Please Provide All Fields");
  }
  // find user by email
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    next("No User found");
  }

  // compare password
  const isMatch = await user.comparePassword(password);
  user.password = undefined;
  if (!isMatch) {
    next("Invalid Username or password");
  }

  const token = user.createJWT();
  res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
  });
};
