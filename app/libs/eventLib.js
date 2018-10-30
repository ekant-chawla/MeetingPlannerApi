const EventEmitter = require('events').EventEmitter

const mailer = require('./mailLib')

//event emitter object that is used thoughout the app to trigger common events
const eventEmitter = new EventEmitter()

eventEmitter.on('signupEmail', mailer.signUpEmail)
eventEmitter.on('forgotPassEmail', mailer.forgotPassEmail)
eventEmitter.on('meetingEmail', mailer.meetingEmail)




module.exports = {
    eventEmitter: eventEmitter
}










