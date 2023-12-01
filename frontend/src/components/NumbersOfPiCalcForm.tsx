import React, {FC, useContext, useEffect, useState} from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import './NumbersOfPiCalcForm.css';
import CalcService from "../services/CalcService"; // Replace with the correct path to your CSS file

const CalcPi: FC = () => {
    const [digits, setDigits] = useState<number>(0);
    const [result, setResult] = useState<string>('');
    const { store } = useContext(Context);
    const [progressUpdate, setProgressUpdate] = useState<string>('');

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:5000/sse');

        eventSource.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);

            switch (data.event) {
                case 'progress':
                    // Handle progress update
                    const progressMessage = `Calculation ${data.calculationId}: ${data.percents}% complete`;
                    console.log(progressMessage);
                    setProgressUpdate("progressMessage");
                    break;

                case 'complete':
                    // Handle completion update
                    const resultMessage = `Calculation ${data.calculationId} completed. Result: ${data.result}`;
                    console.log(resultMessage);
                    setResult(resultMessage);
                    break;

                case 'error':
                    // Handle error update
                    const errorMessage = `Calculation ${data.calculationId} error: ${data.error}`;
                    console.error(errorMessage);
                    setResult(errorMessage);
                    break;

                default:
                    console.warn('Unknown SSE message event:', data.event);
            }
        });

        eventSource.addEventListener('error', (error) => {
            console.error('SSE Error:', error);
        });

        return () => {
            eventSource.close();
        };
    }, []);
    const calculatePi = async () => {
        try {
            const response = await CalcService.calculatePi(digits);
            const newCalculation = response.data; // Access the response data directly
            console.log('Calculation received from the backend:', newCalculation);
            const text = JSON.parse(newCalculation)


            // Display the result in your frontend
            setResult("i love rats"); // Assuming 'content' is the property you want to display
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
            {progressUpdate && (
                <div className="progress-container">
                    <h3>Progress Update:</h3>
                    <p>{progressUpdate}</p>
                    <p>{progressUpdate}</p>
                </div>
            )}
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
