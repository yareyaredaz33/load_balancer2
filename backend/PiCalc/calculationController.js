const CalculationService = require('../PiCalc/calculationService');
const CalculationHistory = require("../Models/CalculationHistory");

class CalculationController {
    constructor() {
        this.calculationService = new CalculationService();
        this.calculatePi = this.calculatePi.bind(this);
        console.log('CalculationService instantiated:', this.calculationService);
    }

    calculatePi(req, res) {

        const numberOfDigits = req.query.numberOfDigits || 5;

        if (!numberOfDigits) {
            return res.status(400).json({ error: 'Number of digits is required.' });
        }
        console.log('this.item:', this.calculationService);

        try {
            console.log('Inside calculatePi:', this); // Log the state of 'this' here

            const result = this.calculationService.calculatePi(numberOfDigits,  (progressData) => {
                console.log(`Calculation ${progressData.id}: ${progressData.percents}% complete`);

                // Send progress update to the client using SSE
                res.write(`event: progress\ndata: ${JSON.stringify({
                    calculationId: progressData.id,
                    percents: progressData.percents,
                })}\n\n`);
            });

            result.then((result) => {
                console.log(`Calculation ${result.id} completed. Result: ${result.value}`);

                // Send completion update to the client using SSE
                res.write(`event: complete\ndata: ${JSON.stringify({
                    calculationId: result.id,
                    result: result.value,
                })}\n\n`);

                // End the SSE connection after sending the complete event
                res.end();
            }).catch((error) => {
                console.error('Calculation error:', error);

                // Send error update to the client using SSE
                res.write(`event: error\ndata: ${JSON.stringify({
                    
                    error: 'Calculation error',
                })}\n\n`);

                // End the SSE connection after sending the error event
                res.end();
            });
        } catch (error) {
            console.error('Error calculating Pi:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getHistory(req, res) {
        try {
            // Fetch calculation history from the database
            const history = await CalculationHistory.findAll();
            res.status(200).json(history);
        } catch (error) {
            console.error('Error fetching calculation history:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = CalculationController;
