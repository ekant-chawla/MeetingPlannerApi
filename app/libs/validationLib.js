let response = require('./responseLib')

let isValidEmail = function (email) {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}
//username that ends with admin is an admin user
let isAdmin = function (userName) {
  let adminRegex = /admin$/
  return adminRegex.test(userName)
}

let isValidPassword = function (password) {
  let passwordRegex = /^[A-Za-z0-9]\w{7,}$/
  return passwordRegex.test(password)
}

let isValidPhone = function (number) {
  let numberRegex = /^\d\d{9}$/
  return numberRegex.test(number)
}

let verifyStartEnd = function (event) {

  let startDate = new Date(event.start)

  if ( startDate> new Date(event.end)) {
    return response.generate(true, 'Meeting start date time cannot be greater than event end date time', 400, null)
  } else if(startDate < new Date()){
    return response.generate(true, 'Meeting start date time cannot be less than current date time', 400, null)
  } else return true
} // Verify that the start date is less than end date and not less than current date time.

module.exports = {
  isValidEmail: isValidEmail,
  isValidPassword: isValidPassword,
  isValidPhone: isValidPhone,
  isAdmin: isAdmin,
  verifyStartEnd:verifyStartEnd
}
