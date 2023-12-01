// index.js
const express = require('express');
const authRouter = require('./authRouter');
const cors = require('cors');

const db = require('./Config/database'); // Update the path to match your project structure

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ['Content-Length', 'Authorization'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());

app.use(cors(corsOptions));
app.use(`/auth`, authRouter);
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        // Check the connection to the database
        await db.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');

        // Create tables based on defined Sequelize models
        await db.sync();

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (e) {
        console.error('Unable to connect to the database:', e);
        process.exit(1); // exit with an error code
    }
};


startServer();

