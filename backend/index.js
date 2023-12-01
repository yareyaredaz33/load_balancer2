/*
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

*/
// index.js
const express = require('express');
const authRouter = require('./authRouter');
const CalculationController = require('./PiCalc/CalculationController');
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
app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');



    // Handle client disconnect
    req.on('close', () => {

        res.end();
    });
});

const PORT = process.env.PORT || 5000;
const servers = ['http://localhost:3001', 'http://localhost:3002']; // Replace with your server URLs
const calculationController = new CalculationController();

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
