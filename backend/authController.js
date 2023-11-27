

const User = require('./models/User')
const Role = require('./models/Role')
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
            return res.json({message: "Registration complete"})
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
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.findAll();

            // Sending the list of users as a JSON response
            res.json(users);
        } catch (e) {
            console.log(e)
        }
    }
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