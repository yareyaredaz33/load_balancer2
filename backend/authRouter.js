const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')
const CalculationController = require('./PiCalc/calculationController');  // Ensure correct import

const calcController = new CalculationController(['http://localhost:3001', 'http://localhost:3002']);  // Instantiate the controller with server URLs
const sseMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // A retry timeout in milliseconds can also be set if desired
    res.setHeader('Retry-After', '3000');
    next();
};

router.post('/registration', [
    check('username', "Name can't be empty").notEmpty(),
    check('password', "Pass should be between 4 and 10 chars").isLength({min:4, max:10})
], controller.registration)
router.post('/login', controller.login)
router.get('/getUsers',  controller.getUsers);
router.get('/check-authorization',  controller.checkAuthorization);
try {
    router.get('/calculatePi', sseMiddleware, calcController.calculatePi)
    console.log('response:', response.data);
} catch (error){
    console.error('Error:', error.message);
}
router.get('/calculationHistory', calcController.getHistory)
router.post('/cancelCalculation', calcController.cancelCalculation)

module.exports = router
