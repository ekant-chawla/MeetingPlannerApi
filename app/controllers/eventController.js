const mongoose = require('mongoose');
const response = require('./../libs/responseLib');
const shortId = require('short-id')
const logger = require('./../libs/loggerLib');
const eventEmitter = require('./../libs/eventLib').eventEmitter
const validationLib = require('./../libs/validationLib')
const config = require('./../../config/appConfig')

const User = mongoose.model('User')
const Meeting = mongoose.model('Meeting')

let createEvent = function (req, res) {

    let userEmail

    let validateInput = function () {
        return new Promise((resolve, reject) => {
            if (!req.user.isAdmin) {
                reject(response.generate(true, 'Only an admin can create meeting', 403, null))
            }
            if (!req.body.userId) {
                reject(response.generate(true, 'User id missing', 400, null))
            }
            if (!req.body.title) {
                reject(response.generate(true, 'Meeting title missing', 400, null))
            }
            if (!req.body.description) {
                reject(response.generate(true, 'Meeting description missing', 400, null))
            }
            if (!req.body.start) {
                reject(response.generate(true, 'Meeting start missing', 400, null))
            }
            if (!req.body.end) {
                reject(response.generate(true, 'Meeting end missing', 400, null))
            }
            if (!req.body.location) {
                reject(response.generate(true, 'Meeting location missing', 400, null))
            }
            if (!req.body.importance) req.body.importance = 1

            let check = validationLib.verifyStartEnd(req.body);
            if (check !== true) {
                reject(check)
            }

            resolve()

        })
    }

    let verifyUserExistsAndNotAdmin = function () {
        return new Promise((resolve, reject) => {
            User.findOne({ userId: req.body.userId }).lean().select('isAdmin email').exec((err, result) => {
                if (err) {
                    logger.error(err.message, 'Event Controller: verifyUserExists', 5)
                    let apiResponse = response.generate(true, 'Internarl server error', 500, null)
                    reject(apiResponse)
                } else if (result) {

                    if (result.isAdmin) {
                        let apiResponse = response.generate(true, 'Cannot create meeting for admin users', 403, null)
                        reject(apiResponse)
                    } else {
                        userEmail = result.email
                        resolve()
                    }

                } else {
                    let apiResponse = response.generate(true, 'No such user exists', 404, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let createEvent = function () {
        return new Promise((resolve, reject) => {


            let event = new Meeting({

                id: shortId.generate(),
                userId: req.body.userId,
                userEmail: userEmail,
                start: req.body.start,
                end: req.body.end,
                title: req.body.title,
                description: req.body.description,
                location: req.body.location,
                monthStart: new Date(req.body.start).getMonth(),
                monthEnd: new Date(req.body.end).getMonth(),
                adminName: req.user.userName,
                importance: req.body.importance,
                color: getColor(req.body.importance)
            })

            event.save((err, result) => {

                if (err) {
                    let apiResponse
                    if (err.name = "ValidationError") {
                        console.log(err.message)
                        apiResponse = response.generate(true, 'Input validation error', 400, null)
                    } else {
                        apiResponse = response.generate(true, "Internal server error", 500, null)
                    }
                    reject(apiResponse)
                } else {
                    resolve(result)
                }
            })
        })

    }

    validateInput()
        .then(verifyUserExistsAndNotAdmin)
        .then(createEvent)
        .then((result) => {

            //Turn the doc into a plain object and remove unncessary fields
            result = result.toObject()
            delete result._id
            delete result.__v
            delete result.createdOn
            delete result.updatedOn
            delete result.monthStart
            delete result.monthEnd
            delete result.year


            let notificationObj = {
                meeting: result,
                title: `Meeting Scheduled`,
                message: `An admin scheduled a meeting for you`,
                type: 'meeting-create'
            }

            sendNotification(notificationObj)

            // remove remaining unnecessary fields
            delete result.userId
            delete result.userEmail

            let apiResponse = response.generate(false, 'Meeting scheduled', 200, result)
            res.send(apiResponse)

        })
        .catch((apiResponse) => {
            res.send(apiResponse)
        })
}

let listEventsForUser = function (req, res) {

    if (!req.body.userId) {
        req.body.userId = req.user.userId
    }

    // handle missing or invalid month by substituting for current month.
    if (!req.body.month || (req.body.month > 11 || req.body.month < 0)) {
        res.send(response.generate(true, 'Invalid month or month missing', 400, null))
        return
    }

    let verifyPermission = function () {

        return new Promise((resolve, reject) => {

            User.findOne({ userId: req.body.userId })
                .lean()
                .select('isAdmin')
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, 'Event Controller: verifyPermission', 5)
                        let apiResponse = response.generate(true, 'Internarl server error', 500, null)
                        reject(apiResponse)
                    } else if (result) {

                        // Allow listing only if requested by the respective user or by admin.
                        if (result.isAdmin) {
                            let apiResponse = response.generate(true, 'Cannot list meetings for admin users', 404, null)
                            reject(apiResponse)
                        }
                        else if (req.user.isAdmin || req.body.userId == req.user.userId) {
                            resolve()
                        } else {
                            let apiResponse = response.generate(true, 'Cannot list meetings for other users', 403, null)
                            reject(apiResponse)
                        }

                    } else {
                        let apiResponse = response.generate(true, 'No such user exists', 404, null)
                        reject(apiResponse)
                    }
                })
        })

    }

    let listEvents = function () {

        return new Promise((resolve, reject) => {
            // Find all events for user id provided that are in given month of current year.
            Meeting.find({ userId: req.body.userId, year: new Date().getFullYear() })
                .or([{ monthStart: req.body.month }, { monthEnd: req.body.month }])
                .lean()
                .select('-monthStart -monthEnd -__v -_id -userId -userEmail -createdOn -updatedOn -year')
                .exec((err, result) => {

                    if (err) {
                        logger.error(err.message, 'Event Controller: verifyPermission', 5)
                        let apiResponse = response.generate(true, 'Internarl server error', 500, null)
                        reject(apiResponse)
                    } else if (result && result.length > 0) {
                        let apiResponse = response.generate(false, 'Meeting list', 200, result)
                        resolve(apiResponse)
                    } else {
                        let apiResponse = response.generate(false, 'No meetings to list in this month', 200, result)
                        resolve(apiResponse)
                    }

                })

        })

    }


    verifyPermission()
        .then(listEvents)
        .then((apiResponse) => {
            res.send(apiResponse)
        })
        .catch((apiResponse) => {
            res.send(apiResponse)
        })

}

let editEvent = function (req, res) {

    if (!req.user.isAdmin) {
        res.send(response.generate(true, 'Only an admin can update meeting', 403, null))
        return
    }

    let verifyEvent = function () {

        return new Promise((resolve, reject) => {

            if (!req.body.eventId) {
                reject(response.generate(true, 'Meeting id is missing', 400, null))
            }

            Meeting.findOne({ id: req.body.eventId })
                .select('-__v -_id -createdOn -year')
                .lean()
                .exec((err, result) => {
                    if (err) {
                        logger.error(err.message, 'Event Controller: verifyEvent', 5)
                        let apiResponse = response.generate(true, 'Internarl server error', 500, null)
                        reject(apiResponse)
                    } else if (result) {
                        resolve(result)
                    } else {
                        let apiResponse = response.generate(true, 'Invalid event id', 404, null)
                        reject(apiResponse)
                    }

                })
        })

    }

    let updateEvent = function (event) {

        return new Promise((resolve, reject) => {
            let change = false // variable to track if there has been a change in the event/meeting

            if (req.body.title) {
                event.title = req.body.title
                change = true
            }
            if (req.body.description) {
                event.description = req.body.description
                change = true
            }
            if (req.body.location) {
                event.location = req.body.location
                change = true
            }

            if (req.body.start) {
                event.start = new Date(req.body.start)
                event.monthStart = event.start.getMonth()
                change = true
            }
            if (req.body.end) {
                event.end = new Date(req.body.end)
                event.monthEnd = event.end.getMonth()
                change = true
            }
            if (req.body.importance) {
                event.importance = req.body.importance
                event.color = getColor(req.body.importance)
            }

            //after the change verify that the event dates still fullfill validation.
            let check = validationLib.verifyStartEnd(event);
            if (check !== true) {
                reject(check)
            }


            if (change) { resolve(event) }
            else { reject(response.generate(true, 'There are no changes to save', 400, null)) }
        })

    }


    let UpdateDB = function (event) {

        event.updatedOn = Date.now()
        Meeting.updateOne({ id: req.body.eventId }, event).exec((err, result) => {

            if (err) {

                let apiResponse
                if (err.name = "ValidationError") {
                    apiResponse = response.generate(true, 'Input validation error.', 400, null)
                } else {
                    apiResponse = response.generate(true, "Internal server error.", 500, null)
                }

                logger.error(err.message, 'Event Controller: updateDB', 5)
                res.send(apiResponse)

            } else {

                delete event.updatedOn
                delete event.monthStart
                delete event.monthEnd

                let notificationObj = {
                    meeting: event,
                    title: `Meeting Update`,
                    message: `An admin updated a meeting`,
                    type: 'meeting-update'
                }

                sendNotification(notificationObj)

                delete event.userId
                delete event.userEmail

                res.send(response.generate(false, 'Meeting updated successfully', 200, event))
            }

        })

    }

    verifyEvent()
        .then(updateEvent)
        .then(UpdateDB)
        .catch((apiResponse) => {
            res.send(apiResponse)
        })

}

let deleteEvent = function (req, res) {

    if (!req.user.isAdmin) {
        res.send(response.generate(true, 'Only an admin can delete meeting', 403, null))
        return
    }


    Meeting.findOneAndRemove({ id: req.body.eventId })
        .exec((err, result) => {

            if (err) {
                logger.error(err.message, 'Event Controller: verifyEvent', 5)
                let apiResponse = response.generate(true, 'Internarl server error', 500, null)
                res.send(apiResponse)
            } else if (result) {
                let apiResponse = response.generate(false, 'Meeting deleted successfully', 200, null)
                res.send(apiResponse)

                //Add email and socket here
                let notificationObj = {
                    meeting: result,
                    title: `Meeting Delete`,
                    message: `An admin deleted a meeting`,
                    type: 'meeting-delete'
                }

                sendNotification(notificationObj)

            } else {
                let apiResponse = response.generate(true, 'No such meeting found', 404, null)
                res.send(apiResponse)
            }

        })

}

//Helper function which calls the notification events.
let sendNotification = function (notificationObj) {

    eventEmitter.emit('notification', notificationObj)
    eventEmitter.emit('meetingEmail', notificationObj)
}

//Helper color which returns the color object based on importance
getColor = function (index) {
    /**Red-High-0 Yelow-medium-1 Green-low-2 */
    colors = [
        {
            primary: '#ad2121',
            secondary: '#FAE3E3',
        },
        {
            primary: '#ffe100',
            secondary: '#e2d88c',
        },
        {
            primary: '#028c12',
            secondary: '#86ce8e',
        }
    ]

    return colors[index]
}

//reminder function which retrives the meetings in next 1 min and sends them notification
let reminder = function () {

    let now = Date.now()
    Meeting.find({ start: { $lte: now + config.reminderTime * 60 * 1000, $gte: now } })
        .lean()
        .exec((err, result) => {

            if (result && result.length > 0) {

                result.forEach((meeting) => {

                    let notificationObj = {
                        meeting: meeting,
                        title: `Meeting Soon`,
                        message: `You have a meeting in ${config.reminderTime} minute`,
                        type: 'reminder'
                    }
                    sendNotification(notificationObj)


                })
            }

        })

}

/* Meeting Alert*/

setInterval(reminder, config.reminderTime * 60 * 1000)




module.exports = {
    createEvent: createEvent,
    listEvent: listEventsForUser,
    editEvent: editEvent,
    deleteEvent: deleteEvent,

}
