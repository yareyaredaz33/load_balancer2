const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')



router.post('/registration', [
    check('username', "Name can't be empty").notEmpty(),
    check('password', "Pass should be between 4 and 10 chars").isLength({min:4, max:10})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', controller.getUsers)



module.exports = router