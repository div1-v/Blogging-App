const nodemailer = require("nodemailer");

function sendPasswordToEmail(email, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yash72200002@gmail.com", // Replace with your email
      pass: "xszbemuusaprolkp", // Replace with your email password
    },
  });

  let mailOptions = {
    from: "yash72200002@gmail.com", // Replace with your email
    to: email,
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailOptions);
}

module.exports = { sendPasswordToEmail };
