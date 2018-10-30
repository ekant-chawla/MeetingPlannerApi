const nodemailer = require('nodemailer')
const logger = require('./loggerLib')
const config = require('./../../config/appConfig')

let sendEmail = function (email, subject, body) {

    const transport = {
        service: 'gmail',
        auth: {
            user: "nodemailer.test.ekant@gmail.com",
            pass: "nodemailer"
        }
    }

    let transporter = nodemailer.createTransport(transport);

    let mailOptions = {
        from: '"Event Calendar App" <nodemailer.test.ekant@gmail.com>', // sender address
        to: email,
        subject: subject,
        html: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(error, "Mailer", 10)
        }
    });
}



let signUpEmail = function (email, firstName) {

    sendEmail(email, "Welcome Email", `Thank you for signing up at Event Caledar app ${firstName}. Stay organized!`)

}


let forgotPassEmail = function (email, passResetToken) {
    //change url based on environment.
    let html = `<p> Ohh.. did you forget your pass? No worries! simply click on the below link <br> <a href ='${config.url}/reset-password?token=${passResetToken}' > link </a></p>`
    sendEmail(email, "Password Reset", html)

}

let meetingEmail = function (notificationObj) {

    console.log(typeof notificationObj.meeting.start)
    let html = `<p>${notificationObj.message}<p>
        <p> Meeting Title : ${notificationObj.meeting.title}</p>
        <p> Meeting Purpose : ${notificationObj.meeting.description}</p>
        <p> Meeting Location : ${notificationObj.meeting.location}</p>
        <p> Meeting Time : ${notificationObj.meeting.start}</p>
    `
    sendEmail(notificationObj.meeting.userEmail, notificationObj.title, html)

}



module.exports = {
    sendEmail: sendEmail,
    signUpEmail: signUpEmail,
    forgotPassEmail: forgotPassEmail,
    meetingEmail: meetingEmail
}