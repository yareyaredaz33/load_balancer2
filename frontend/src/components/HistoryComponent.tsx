// CalculationHistoryList.js
import React, { FC, useEffect, useState } from 'react';
import CalcService from '../services/CalcService';
import './CalculationHistoryList.css'; // Include the CSS file
import {ICalcHistory} from "../models/ICalcHistory";

const CalculationHistoryList: FC = () => {
    const [history, setHistory] = useState<ICalcHistory[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await CalcService.getCalculationHistory();
                // Assuming the response.data contains the 'history' property
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching calculation history:', error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="history-container">
            <h2>Calculation History</h2>
            <ul>
                {history.map((calculation) => (
                    <li key={calculation.id}>
                        <p>Result: {calculation.result}</p>
                        <p>Time: {calculation.time}</p>
                        <p>Is Finished: {calculation.isFinished ? 'Yes' : 'No'}</p>
                        <p>User ID: {calculation.user_id}</p>
                        {/* Add more details as needed */}
                        <p>Created At: {calculation.createdAt}</p>
                        <p>Updated At: {calculation.updatedAt}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CalculationHistoryList;