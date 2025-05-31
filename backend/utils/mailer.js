const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: '"eShop" <no-reply@eshop.com>',
    to,
    subject,
    html,
  });
};
