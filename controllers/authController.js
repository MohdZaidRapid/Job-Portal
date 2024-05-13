import userModel from "../models/userModel.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    // validate
    if (!name) {
      next("name is required");
    }
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide email" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide password" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Email Already Registered Please Login",
      });
    }
    const user = await userModel.create({ name, email, password });
    res
      .status(201)
      .send({ success: true, message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
