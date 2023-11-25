const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:1111@localhost:5432/auth_roles', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: false, // Встановіть на true, якщо використовуєте SSL
    },
});
// Test the connection
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
