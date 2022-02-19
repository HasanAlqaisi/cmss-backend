import nodemailer from "nodemailer";

export default async (
  id: number,
  email: string,
  token: string,
  url: string,
  text: string,
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

  const link = `${url}/${id}/${token}`;

  // send mail with defined transport object
  await transporter.sendMail({
    from: `"Hasan AlQaisi" <${process.env.EMAIL}>`, // sender address
    to: email, // list of receivers
    subject, // Subject line
    text, // plain text body
    html: `<p>Please click this link: <a href="${link}">${link}</a></p>`, // html body
  });
};
