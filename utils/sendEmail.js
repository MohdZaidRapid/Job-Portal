const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "yourusername@example.com",
    pass: "yourpassword",
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

  console.log("Message sent: %s", info.messageId);
}

// Example usage
export default sendPasswordResetEmail;
