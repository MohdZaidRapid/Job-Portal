import userModel from "../models/userModel.js";

export const forgotPasswordController = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and store reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email with token
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ resetToken: token });

    if (!user || !user.isPasswordResetTokenValid(token)) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Reset password
    user.password = newPassword;
    user.resetToken = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
