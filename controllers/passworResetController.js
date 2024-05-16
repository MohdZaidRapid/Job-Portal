import userModel from "../models/userModel.js";

export const resetPasswordController = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const user = await userModel.findOne({ resetToken: token });

    if (!user || !user.isPasswordResetTokenValid(token)) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
