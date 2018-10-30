const express = require('express')
const userController = require('./../controllers/userController');
const config = require('./../../config/appConfig')
const routeMiddleware = require('./../middlewares/routeMiddleware');


let setRoutes = function (app) {
    let baseUrl = config.version + "/user"

    app.post(baseUrl + '/signup', userController.signup);

    /**
     * @api {post} http://meetingapi.ekantchawla.me/api/v1/user/signup Signup
     * @apiVersion 1.0.0
     * @apiGroup Create
     *
     * @apiDescription Signup new user with a valid email id and password. Passowrd must be at least 8 characters.
     * 
     * @apiParam {String} email E-mail id of the user
     * @apiParam {String} password Password of the user
     * @apiParam {String} firstName First name of the user
     * @apiParam {String} lastName Last name of the user (Optional)
     * @apiParam {String} phone Phone number
     * @apiParam {String} countryCode Country code
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
    "error": false,
    "message": "User registered successfully.",
    "status": 200,
    "data": null,
    "timestamp": 1535440227612
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

    app.post(baseUrl + '/login', userController.login);

    /**
     * @api {post} http://meetingapi.ekantchawla.me/api/v1/user/login Login
     * @apiVersion 1.0.0
     * @apiGroup Read
     * 
     * @apiDescription The login api of the application. Used to obtain the authToken for all other api.
     *
     * @apiParam {String} email E-mail id of the user
     * @apiParam {String} password Password of the user
     * 
     * 
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
    "error": false,
    "message": "User logged in",
    "status": 200,
    "data": {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Imxhc3ROYW1lIjoiIiwiZW1haWwiOiJla2FudC5jaGF3bGExQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6IkVrYW50IiwidXNlcklkIjoiZjVkNjk0In0sImV4cCI6MTUzNTUyMjQwOSwic3ViIjoiQXV0aFRva2VuIiwiaXNzIjoiQ2hhdEFwcCIsImlhdCI6MTUzNTQzNjAwOH0.q8TClbik4JhW1R75Q1wnNdCyznuGRUivHR1ZbI7B8Iw",
        "userId": "f5d694",
        "firstName": "Ekant",
        "lastName": ""
    },
    "timestamp": 1535436008861
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



    app.post(baseUrl + '/updatePass', routeMiddleware.verifyPassResetToken, userController.updatePassword);

    /**
     * @api {post} http://meetingapi.ekantchawla.me/api/v1/user/updatePass Update password
     * @apiVersion 1.0.0
     * @apiGroup Update
     *
     * @apiDescription Reset the password of the user using the password reset url.
     * 
     * @apiParam {String} authToken Password reset auth token provided at the end of the password reset url
     * @apiParam {String} password New password of the user
     * 
     * 
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
    "error": false,
    "message": "Password updated",
    "status": 200,
    "data": null,
    "timestamp": 1535436008861
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



    app.post(baseUrl + '/forgotPass', userController.forgotPassword)

    /**
  * @api {post} http://meetingapi.ekantchawla.me/api/v1/user/forgotPass Password reset
  * @apiVersion 1.0.0
  * @apiGroup Update
  *
  * @apiDescription Send password reset email to the user on the registered email id.
  * 
  * @apiParam {String} email Registered email of the user
  * 
  * 
  *
  *  @apiSuccessExample {json} Success-Response:
  *  {
 "error": false,
 "message": "Password reset email sent.",
 "status": 200,
 "data": null,
 "timestamp": 1535436008861
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

    app.post(baseUrl + '/listUsers', routeMiddleware.verifyAuthToken, userController.listUsers)

/**
  * @api {post} http://meetingapi.ekantchawla.me/api/v1/user/listUsers List users
  * @apiVersion 1.0.0
  * @apiGroup Read
  *
  * @apiDescription Lists the normal users on the server. Only admin users will get a success.
  * 
  * @apiParam {String} authToken Auth token of the admin user.
  *  
  *
  *  @apiSuccessExample {json} Success-Response:
  *  {
    "error": false,
    "message": "User list",
    "status": 200,
    "data": [
        {
            "_id": "5bcdbe73e53eb60444c0ca6c",
            "lastName": "Chawla",
            "firstName": "Ekant",
            "userId": "d42135",
            "userName": "Ekant_Chawla"
        }
    ],
    "timestamp": 1540803260129
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
