import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({path: '.env'});

export async function sendMail(sub: string, body: string, recipient: string){

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.globat.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.Mailer, // generated ethereal user
      pass: process.env.Password // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <noreply@adp.ng>', // sender address
    to: `${recipient}`, // list of receivers
    subject: sub, // Subject line
    html: body // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}