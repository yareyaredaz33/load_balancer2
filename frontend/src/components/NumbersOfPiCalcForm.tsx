import React, {FC, useContext, useEffect, useState} from 'react';
import {Context} from '../index';
import {observer} from 'mobx-react-lite';
import './NumbersOfPiCalcForm.css';
import CalcService from "../services/CalcService"; // Replace with the correct path to your CSS file

const CalcPi: FC = () => {
    const [digits, setDigits] = useState<number>(0);
    const [result, setResult] = useState<string>('');
    const {store} = useContext(Context);
    const [progressUpdate, setProgressUpdate] = useState<number>(0);
    const [workerId, setworkerId] = useState(0);

    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    useEffect(() => {
        if (eventSource) {
            console.log(eventSource)
            eventSource.addEventListener('progress', (e) => {

                const data = JSON.parse(e.data);
                setworkerId(data.calculationId);
                setProgressUpdate(data.percents.toFixed(1))
                setResult(data.currentValue)
                console.log(`Progress: ${data.calculationId} - ${data.percents}%`);
                console.log(`Progress: ${data.worker}%`);

            });

            eventSource.addEventListener('complete', (e) => {
                const data = JSON.parse(e.data);

                setProgressUpdate(100);
                console.log(data)
                setResult(data.result)
                setIsCalculating(false);
                eventSource.close()
            });

            eventSource.onerror =()=> {
                eventSource.close()
            }

            return () => {
                eventSource.close();
            };
        }
    }, [eventSource]);
    const calculatePi = async () => {
        setIsCalculating(true);
        if (eventSource) {
            eventSource.close();
        }

        const newEventSource = new EventSource(`http://localhost:4001/auth/calculatePi?numberOfDigits=${digits}`);

        setEventSource(newEventSource);

    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(isCalculating){
            setIsCalculating(false);
            await CalcService.cancelCalculation();
            if (eventSource) {
                eventSource.close();
            }
        }
        else{
            await calculatePi();
        }


    };
    return (
        <div className="form-container">
            <form >
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
                    {/*<button type="submit">Calculate Pi</button>*/}
                    <button type="submit" onClick={handleSubmit}>{isCalculating ? 'Cancel' : 'Calculate Pi'}</button>
                </div>
            </form>
            {progressUpdate && (
                <div className="progress-container">
                    <h3>Progress Update:</h3>
                    <p>{progressUpdate} %</p>
                </div>
            )}
            {(
                <div >
                    <h3>Result:</h3>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
};

export default observer(CalcPi);
