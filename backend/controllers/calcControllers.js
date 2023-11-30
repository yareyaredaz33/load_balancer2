
const User = require('../models/User')
const Role = require('../models/Role')
const CalculationHistory = require('../Models/CalculationHistory');
const Big = require('big.js');
function* generateDigitsOfPi() {
    let q = BigInt(1);
    let r = BigInt(180);
    let t = BigInt(60);
    let i = BigInt(2);

    while (true) {
        let digit = ((i * BigInt(27) - BigInt(12)) * q + r * BigInt(5)) / (t * BigInt(5));
        yield Number(digit);

        let u = i * BigInt(3);
        u = (u + BigInt(1)) * BigInt(3) * (u + BigInt(2));
        r = u * BigInt(10) * (q * (i * BigInt(5) - BigInt(2)) + r - t * digit);
        q *= BigInt(10) * i * (i++ * BigInt(2) - BigInt(1));
        t *= u;

    }
}
class CalculationController {
    constructor() {

    }

    async calculatePi(req, res) {
        try {
            const numberOfDigits = req.query.numberOfDigits || 5;

            // Create a new worker
            const piWorker = new Worker('./piCalculationWorker.js');

            // Set up the message listener to handle the result from the worker
            piWorker.onmessage = (event) => {
                const { content: pi } = event.data;

                // Stop the worker
                piWorker.terminate();

                // Save the calculation history and send the result back
                // (Note: You need to implement the database save logic)
                const userId = 5;
                res.status(200).json({ content: pi });

                // Save the calculation history to the database
                CalculationHistory.create({
                    result: pi.toString(),
                    time: executionTime,
                    isFinished: true,
                    user_id: userId,
                });
            };

            // Start the worker and pass the required data
            piWorker.postMessage({ numberOfDigits });
        } catch (error) {
            console.error('Error calculating Pi:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getHistory(req, res) {
        try {
            // Fetch calculation history from the database
            const history = await CalculationHistory.findAll();
            res.status(200).json({ history });
        } catch (error) {
            console.error('Error fetching calculation history:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    /*async saveCalculationHistory(result, time, isFinished, userId) {
        try {
            // Create a new calculation history entry
            await CalculationHistory.create({
                result,
                time,
                isFinished,
                user_id: userId,
            });
        } catch (error) {
            console.error('Error saving calculation history:', error);
        }
    }*/
    /*async calculatePiValue(numberOfDigits) {
        try {
            // Implement your pi calculation logic here based on the provided numberOfDigits
            // For example, you can use the Big.js library as you did before
            Big.DP = numberOfDigits; // Set precision
            const a = Big(1).div(5);
            const b = Big(1).div(239);

            let pi = Big(0);

            for (let i = 0; i < numberOfDigits; i++) {
                const term1 = a.div(2 * i + 1);
                const term2 = b.div(2 * i + 1);

                pi = pi.plus(term1.minus(term2));
            }

            pi = pi.times(4);
            return pi;
        } catch (error) {
            console.error('Error calculating Pi:', error);
            return Big(0); // Return a default value or handle the error as needed
        }
    }*/
}

module.exports = new CalculationController();
