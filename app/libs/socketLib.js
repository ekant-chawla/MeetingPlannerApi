const socketIo = require('socket.io')
const eventEmitter = require('./eventLib').eventEmitter
const tokenLib = require('./tokenLib')
const config = require('./../../config/appConfig')
const mongoose = require('mongoose')
const logger = require('./loggerLib')


let setSocketServer = function (server) {

    socketServer = socketIo.listen(server).of(config.version + '/notification')


    /**
           * @api {socket} http://meetingapi.ekantchawla.me/api/v1/notification Socket URL
           * @apiVersion 1.0.0
           * @apiGroup App Socket URL
           * @apiDescription This is the url where the client must make a socket connection
           *            
          */


    socketServer.on('connection', (socket) => {


        console.log("A new user tried to connected")

        socket.emit('verifyUser', '')


        /**
           * @api {event}  verifyUser Verify user
           * @apiVersion 1.0.0
           * @apiGroup Listen
           * @apiDescription This event should be listened to by the client, after this the client can then emit setUser event.
           * 
           *
          */
        socket.on('setUser', (authToken) => {
            tokenLib.verifyToken(authToken, (err, decoded) => {
                if (err) {
                    socket.emit('authError', '')
                } else {
                    socket.userId = decoded.user.userId
                    console.log(socket.userId + " connected to socket server")
                }
            })
        })

        /**
   * @api {event}  authError Auth error
   * @apiVersion 1.0.0
   * @apiGroup Listen
   * @apiDescription This event is emitted by the server if it finds that the authToken is invalid or socket is missing user detail.
   * 
   *
  */

        /**
         * @api {event}  setUser Set user
         * @apiVersion 1.0.0
         * @apiGroup Emit
         * @apiDescription This event should emitted by the client to register and set user detail to the socket connection. This works as a handshake.
         * 
         *
        */



        socket.on("disconnect", () => {
            console.log(`${socket.userId} disconnected`)
            socket.userId = null // this was added to tackle an issue of multiple connections! Apparently the socket io server does not suspend the removed connection and even after disconnection they keep receiving messages from the rooms.
        })

    })

     /**
         * @api {event}  userId Notification
         * @apiVersion 1.0.0
         * @apiGroup Listen
         * @apiDescription The client should listen to the event [userId] for notifications that are emitted for that user. Eg. to listen to notificaions for user with id 123abc the client must listen for the event '123abc'
         * 
         *
        */

    eventEmitter.on('notification', (notificationObj) => {

        socketServer.emit(notificationObj.meeting.userId, notificationObj)

    })


}

module.exports = {
    setSocketServer: setSocketServer
}