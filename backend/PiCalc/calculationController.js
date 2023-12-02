const CalculationService = require('../PiCalc/calculationService');
const CalculationHistory = require("../Models/CalculationHistory");
const jwt = require("jsonwebtoken");
const {secret} = require("../Config/config");

class CalculationController {
    constructor() {
        this.calculationService = new CalculationService();
        this.calculatePi = this.calculatePi.bind(this);
        this.cancelCalculation = this.cancelCalculation.bind(this);
        console.log('CalculationService instantiated:', this.calculationService);

    }

    calculatePi(req, res) {

        const numberOfDigits = req.query.numberOfDigits || 5;

        if (!numberOfDigits) {
            return res.status(400).json({ error: 'Number of digits is required.' });
        }
        console.log('this.item:', this.calculationService);

        try {
            console.log('Inside calculatePi:', this);

            const result = this.calculationService.calculatePi(numberOfDigits,  (progressData) => {
                console.log(progressData);

                res.write(`event: progress\ndata: ${JSON.stringify({
                    
                    calculationId: progressData.id,
                    percents: progressData.percents,
                    currentValue: progressData.value,
                })}\n\n`);
            });

            result.then(async (result) => {

                console.log(`Calculation ${result.id} completed. Result: ${result.value}`);


                res.write(`event: complete\ndata: ${JSON.stringify({
                    calculationId: result.id,
                    result: result.value,
                })}\n\n`);

                try {
                    const calculationHistory = new CalculationHistory({
                        result: result.value,
                        time: result.duration,
                        isFinished: true,
                        user_id: 5
                    })
                    await calculationHistory.save()
                } catch (e) {
                    console.log(e)
                }

                res.end();
            }).catch((error) => {
                console.error('Calculation error:', error);

                res.write(`event: error\ndata: ${JSON.stringify({

                    error: 'Calculation error',
                })}\n\n`);

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
    async cancelCalculation(req, res) {
        try {
            // Extract the calculationId from the request parameters or body
            let isCancelled = false;

            // Assuming CalculationService has a method to cancel calculations
            isCancelled = this.calculationService.cancelCalculation();

            if (isCancelled) {
                return res.status(200).json({ message: 'Calculation cancelled successfully.' });
            } else {
                return res.status(404).json({ error: 'Calculation not found or already completed.' });
            }
        } catch (error) {
            console.error('Error cancelling calculation:', error);
            return res.status(500).json({ error: 'Internal Server Error, cant cancel' });
        }
    }
}

module.exports = CalculationController;
