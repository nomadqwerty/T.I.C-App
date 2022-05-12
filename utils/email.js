const nodemailer = require('nodemailer')

const sendEmail = async(options)=>{
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            password:process.env.EMAIL_PASSWORD,
        }
    })
    // set mailOPtions
    const mailOptions = {
        from:'davexmike72@gmail.com',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    // send mail
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail

