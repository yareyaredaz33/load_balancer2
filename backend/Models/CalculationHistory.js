const { DataTypes } = require('sequelize');
const db = require('../config/database');
const User = require('./User'); // Assuming you have a User model defined

const CalculationHistory = db.define('CalculationHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    result: {
        type: DataTypes.STRING, // Change the data type based on the actual type you want to store
        allowNull: false,
    },
    time: {
        type: DataTypes.FLOAT, // Change the data type to INTEGER
        allowNull: false,
    },
    isFinished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Assuming the default value is false
    },
    user_id: {
        type: DataTypes.INTEGER, // Assuming user_id is of INTEGER type
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

db.sync()

// Assuming you have a Users table defined
CalculationHistory.belongsTo(User, { foreignKey: 'user_id' });

module.exports = CalculationHistory;
