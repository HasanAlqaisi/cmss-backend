import nodemailer from "nodemailer";

export default async (
  email: string,
  text: string,
  html: string,
  subject: string
) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `"Hasan AlQaisi" <${process.env.EMAIL}>`, // sender address
    to: email, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
};
