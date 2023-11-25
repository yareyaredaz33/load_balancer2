// index.js
const express = require('express');
const authRouter = require('./authRouter');
const db = require('./Config/database'); // Update the path to match your project structure

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
/*app.use("/auth", authRouter);*/

const start = async () => {
    try {
        // Check the connection to the database
        await db.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');

        // Create tables based on defined Sequelize models
        await db.sync();

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.error('Unable to connect to the database:', e);
    }
};

start();
