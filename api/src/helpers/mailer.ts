import nodemailer from "nodemailer";
import config from "../config";
// create a transport object
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.address,
    pass: config.email.pass,
  },
});

export const sendMail = (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: "agu.chijioke@testproject.com",
    to,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
