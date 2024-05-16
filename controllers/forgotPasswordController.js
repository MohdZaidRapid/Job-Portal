import userModel from "../models/userModel.js";
import sendPasswordResetEmail from "../utils//sendEmail.js";

export const forgotPasswordController = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
