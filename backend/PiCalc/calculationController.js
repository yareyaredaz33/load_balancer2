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
                // Log the structure of progressData
                console.log('Received progress data:', JSON.stringify(progressData, null, 2));

                // Handle progress updates here
                console.log('Progress:', progressData);

            })

            return res.status(200).json({ result });

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
