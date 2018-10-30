const config = {};

config.port = 3000;
config.database = {
    url: "mongodb://127.0.0.1:27017/eventAppDb"
}
config.allowedOrigins = "*"
config.version = "/api/v1"
config.env = "dev"
config.tokenExpiry = 1000 //token expires after this many hours
config.pageSize = 10
//config.url = 'http://localhost:4200'
config.url = 'http://meetingapp.ekantchawla.me' // front end url
config.reminderTime = 1 //time before meeting notification in minutes

module.exports = config;