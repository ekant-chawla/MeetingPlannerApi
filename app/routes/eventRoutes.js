const express = require('express')
const eventController = require('./../controllers/eventController');
const config = require('./../../config/appConfig')
const routeMiddleware = require('./../middlewares/routeMiddleware');


let setRoutes = function (app) {
    let baseUrl = config.version + "/event"
    app.post(baseUrl + '/create', routeMiddleware.verifyAuthToken, eventController.createEvent);

     /**
  * @api {post} http://meetingapi.ekantchawla.me/api/v1/event/create Create meeting
  * @apiVersion 1.0.0
  * @apiGroup Create
  *
  * @apiDescription Schedule a meeting for the user with provided detail.
  * 
  * @apiParam {String} authToken Auth token of the admin creating the api.
  * @apiParam {String} userId User id of the user for whom the meeting is to be scheduled
  * @apiParam {String} title Title of the meeting
  * @apiParam {String} description A description or purpose of the meeting
  * @apiParam {Date} start Start of the meeting
  * @apiParam {Date} end End of the meeting
  * @apiParam {String} location Location of the meeting
  * @apiParam {Number} importance Importance level of the meeting, can be 0, 1 or 2. Color is based on this. Defaluts to 1 (Optional)  
  * 
  *
  *  @apiSuccessExample {json} Success-Response:
  *  {
    "error": false,
    "message": "Meeting scheduled",
    "status": 200,
    "data": {
        "color": {
            "primary": "#ffe100",
            "secondary": "#e2d88c"
        },
        "id": "d0f390",
        "start": "2018-11-23T11:31:50.430Z",
        "end": "2018-11-24T11:31:50.430Z",
        "title": "Metting",
        "description": "Event description",
        "location": "Delhi",
        "adminName": "testadmin",
        "importance": 1
    },
    "timestamp": 1540804839318
}
     
 * @apiErrorExample {json} Error-Response:
 * {
     "error": true,
     "message": "Internal server error",
     "status": 500,
     "data": null,
     "timestamp": 1535440227612
    }
 */

    app.post(baseUrl + '/list', routeMiddleware.verifyAuthToken, eventController.listEvent);


      /**
  * @api {post} http://meetingapi.ekantchawla.me/api/v1/event/list List meeting
  * @apiVersion 1.0.0
  * @apiGroup Read
  *
  * @apiDescription Schedule a meeting for the user with provided detail.
  * 
  * @apiParam {String} authToken Auth token of the admin creating the api.
  * @apiParam {String} userId User id of the user for whom the meeting is to be listed. If not provided then it will return list for querying user (Optional)
  * @apiParam {Number} month Month for which the meetings should be listed. If not provided then it will return list for current month. Valid months 0 to 11 (Optional) 
  *
  *  @apiSuccessExample {json} Success-Response:
  *  {
    "error": false,
    "message": "Meeting list",
    "status": 200,
    "data": [
        {
            "color": {
                "primary": "#028c12",
                "secondary": "#86ce8e"
            },
            "id": "fe3d9c",
            "start": "2018-10-29T08:19:50.000Z",
            "end": "2018-10-29T10:10:50.000Z",
            "title": "Test color",
            "description": "test",
            "location": "Delhi",
            "adminName": "testadmin",
            "importance": 2
        }
    ],
    "timestamp": 1540805391176
}
     
 * @apiErrorExample {json} Error-Response:
 * {
     "error": true,
     "message": "Internal server error",
     "status": 500,
     "data": null,
     "timestamp": 1535440227612
    }
 */


    app.post(baseUrl + '/edit', routeMiddleware.verifyAuthToken, eventController.editEvent);


      /**
  * @api {post} http://meetingapi.ekantchawla.me/api/v1/event/edit Edit meeting
  * @apiVersion 1.0.0
  * @apiGroup Update
  *
  * @apiDescription Edit an already scheduled meeting for the user with provided detail.
  * 
  * @apiParam {String} authToken Auth token of the admin creating the api.
  * @apiParam {String} eventId Id of the meeting to be edited
  * @apiParam {String} title Title of the meeting (Optional)  
  * @apiParam {String} description A description or purpose of the meeting (Optional)  
  * @apiParam {Date} start Start of the meeting (Optional)  
  * @apiParam {Date} end End of the meeting (Optional)  
  * @apiParam {String} location Location of the meeting (Optional)  
  * @apiParam {Number} importance Importance level of the meeting, can be 0, 1 or 2 (Optional)  
  * 
  *
  *  @apiSuccessExample {json} Success-Response:
  *  {
    "error": false,
    "message": "Meeting updated successfully",
    "status": 200,
    "data": {
        "color": {
            "primary": "#ffe100",
            "secondary": "#e2d88c"
        },
        "id": "d0f390",
        "start": "2018-11-23T11:31:50.430Z",
        "end": "2018-11-24T11:31:50.430Z",
        "title": "updated Titile",
        "description": "Event description",
        "location": "Delhi",
        "adminName": "testadmin",
        "importance": 1
    },
    "timestamp": 1540805795240
}
     
 * @apiErrorExample {json} Error-Response:
 * {
     "error": true,
     "message": "Internal server error",
     "status": 500,
     "data": null,
     "timestamp": 1535440227612
    }
 */



    app.post(baseUrl + '/delete', routeMiddleware.verifyAuthToken, eventController.deleteEvent);


      /**
  * @api {post} http://meetingapi.ekantchawla.me/api/v1/event/delete Delete meeting
  * @apiVersion 1.0.0
  * @apiGroup Delete
  *
  * @apiDescription Delete a scheduled meeting.
  * 
  * @apiParam {String} authToken Auth token of the admin.
  * @apiParam {String} eventId Id of the meeting to be deleted
  * 
  *
  *  @apiSuccessExample {json} Success-Response:
  *  {
    "error": false,
    "message": "Meeting deleted successfully",
    "status": 200,
    "data": null,
    "timestamp": 1540806203262
}
     
 * @apiErrorExample {json} Error-Response:
 * {
     "error": true,
     "message": "Internal server error",
     "status": 500,
     "data": null,
     "timestamp": 1535440227612
    }
 */


}


module.exports = {
    setRoutes: setRoutes
}
