// Assuming you have a Role model defined in Role.js
const Role = require('./Role');
const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Assuming you have a Roles table defined
User.belongsToMany(Role, { through: 'UserRoles' });



module.exports = User;