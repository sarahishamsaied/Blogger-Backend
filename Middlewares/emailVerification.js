const nodemailer = require("nodemailer");
const verifyEmail = async (email,message) =>{
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        service : "gmail",
        auth:{
            user:process.env.APP_USER,
            pass:process.env.APP_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        },
        port: 587,
        secure: false,
    });
    let info = await transporter.sendMail({
        from: '"Blogger App 👻"', // sender address
        to: email, // list of receivers
        subject: "Email Verification ✔", // Subject line
        html:message
      });
      console.log(info)
}
module.exports = verifyEmail;