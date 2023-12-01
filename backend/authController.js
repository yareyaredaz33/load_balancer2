
const User = require('./models/User')
const Role = require('./models/Role')
const CalculationHistory = require('./Models/CalculationHistory');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secret} = require("./Config/config")




const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}


class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors})
            }
            const {username, password} = req.body;
            const candidate = await User.findOne({ where: { username } });
            if (candidate) {
                return res.status(400).json({message: "There's already a user with such username"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})
            await user.save()
            const token = generateAccessToken(user._id, user.roles)
            return res.json({
                token,
                user: {
                    username: user.username,
                    id: user.id
                }
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({
                where: { username: username }
            });

            if (!user) {
                return res.status(400).json({message: `There's no user ${username}`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Wrong password`})
            }
            const token = generateAccessToken(user._id, user.roles)
            return res.json({
                token,
                user: {
                    username: user.username,
                    id: user.id
                }
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.findAll();

            // Check if 'users' is undefined before iterating
            if (users) {
                // Sending the list of users as a JSON response
                res.json(users);
            } else {
                // Handle the case where 'users' is undefined
                res.status(404).json({ error: 'No users found' });
            }
        } catch (e) {
            console.log(e);
            // Handle other errors if necessary
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async checkAuthorization(req, res, next) {
        try {
            const authorizationHeader = req.headers['authorization'];
            console.log('Authorization Header:', authorizationHeader);

            if (!authorizationHeader) {
                return res.status(403).json({ message: 'User not authorized, no token' });
            }

            const token = authorizationHeader.split(' ')[1];
            console.log('token:', token);

            if (!token) {
                return res.status(403).json({ message: 'User not authorized, NO token' });
            }

            const decodedData = jwt.verify(token, secret);
            req.user = decodedData;
            res.json('hello');

            next();
        } catch (e) {
            console.error(e);
            return res.status(403).json({ message: 'User not authorized' });
        }
    }

    /* async addCalculationHistory(req, res) {
         try {
             // Sample data for demonstration
             const sampleResult = '3.14159265358979323846'; // Replace with your actual result
             const sampleTime = new Date();
             const sampleIsFinished = true; // Replace with your actual value

             // Assuming you have a user with ID 1 for demonstration
             const userId = 5;

             // Create a new calculation history entry
             const newCalculation = await CalculationHistory.create({
                 result: sampleResult,
                 time: sampleTime,
                 isFinished: sampleIsFinished,
                 user_id: userId, // Set the user_id foreign key
             });

             res.status(201).json(newCalculation);
         } catch (error) {
             console.error('Error adding calculation history:', error);
             res.status(500).json({ error: 'Internal Server Error' });
         }
     };*/



}

/*class authController{
    async registration(req,res){

    }
    async login(req,res){

    }
    async getUsers(req, res) {
        try {
            // Assuming you have a Sequelize model named UserModel
            const users = await User.findAll();

            // Sending the list of users as a JSON response
            res.json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    }*/
module.exports = new authController()