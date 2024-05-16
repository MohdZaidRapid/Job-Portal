const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "70d9cbdc4660c7",
    pass: "65482f82ec9208",
  },
});
// Function to send password reset email
function sendPasswordResetEmail(email, resetLink) {
  // Send mail with defined transport object
  let info = transporter.sendMail({
    from: '"Your Name" <yourusername@example.com>',
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
    html: `<p>Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  });
}

// Example usage
export default sendPasswordResetEmail;
