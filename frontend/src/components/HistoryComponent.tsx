// CalculationHistoryList.js
import React, { FC, useEffect, useState } from 'react';
import CalcService from '../services/CalcService';
import './HistoryComponent.css'; // Include the CSS file
import {ICalcHistory} from "../models/ICalcHistory";

const CalculationHistoryList: FC = () => {
    const [history, setHistory] = useState<ICalcHistory[]>([]);

    const fetchHistory = async () => {
        try {
            const response = await CalcService.getCalculationHistory();
            // Assuming the response.data contains the 'history' property
            setHistory(response.data.reverse());
        } catch (error) {
            console.error('Error fetching calculation history:', error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleUpdateHistory = async () => {
        // Call the fetchHistory function to update the history
        await fetchHistory();
    };

    return (
        <div className="history-container">
            <h2>Calculation History</h2>
            <button className="update-button" onClick={handleUpdateHistory}>
                Update History
            </button>
            <ul>
                {history.map((calculation) => (
                    <li key={calculation.id}>
                        <p className="result">Result: {calculation.result}</p>
                        <p>Time: {calculation.time}</p>
                        <p>Is Finished: {calculation.isFinished ? 'Yes' : 'No'}</p>
                        <p>User ID: {calculation.user_id}</p>
                        <p>Created At: {new Date(calculation.createdAt).toLocaleString()}</p>

                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CalculationHistoryList;