import React, { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import './NumbersOfPiCalcForm.css';
import CalcService from "../services/CalcService"; // Replace with the correct path to your CSS file

const CalcPi: FC = () => {
    const [digits, setDigits] = useState<number>(0);
    const [result, setResult] = useState<string>('');
    const { store } = useContext(Context);

    const calculatePi = async () => {
        try {
            const response = await CalcService.calculatePi(digits);
            const newCalculation = response.data; // Access the response data directly
            console.log('Calculation received from the backend:', newCalculation);
            // Display the result in your frontend
            setResult(newCalculation.content); // Assuming 'content' is the property you want to display
        } catch (error) {
            console.error('Error fetching calculation history:', error);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await calculatePi();
    };
    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="digits">Enter the number of digits:</label>
                    <input
                        id="digits"
                        type="number"
                        value={digits}
                        onChange={(e) => setDigits(Number(e.target.value))}
                        placeholder="Number of digits"
                        min="0"
                        className="form-group input"
                    />
                </div>
                <div className="form-group button-container">
                    <button type="submit">Calculate Pi</button>
                </div>
            </form>

            {result && (
                <div className="result-container">
                    <h3>Result:</h3>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
};

export default observer(CalcPi);
