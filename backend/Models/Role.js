const { DataTypes } = require('sequelize');
const db = require('../Config/database'); // You'll need to create a database connection

const Role = db.define('Role', {
    value: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: 'USER',
    },
});

module.exports = Role;
