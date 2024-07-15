require("dotenv").config();
const nodeMailer = require("nodemailer");

const sendEmail = async (to, resetToken) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "abrsh6266@gmail.com",
        pass: process.env.EMAILPASSWORD,
      },
    });
    const message = {
      to,
      subject: "Password reset",
      html: `
          <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
          <p>Please click on the following link, or paste this into your browser to complete the process:</p>
          <p>https://localhost:3000/reset-password/${resetToken}</p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          `,
    };

    const info = await transporter.sendMail(message);
    console.log("Email sent", info.messageId);
  } catch (error) {
    console.log(error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
