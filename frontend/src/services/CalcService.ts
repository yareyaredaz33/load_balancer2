// CalcService.js
import $api from '../http';
import { AxiosResponse } from 'axios';
import {ICalcHistory} from "../models/ICalcHistory";
export default class CalcService {
    static async calculatePi(numberOfDigits: number) {
        return $api.post(`/calculatePi?numberOfDigits=${numberOfDigits}`);
    }
    static async getCalculationHistory(): Promise<AxiosResponse<Array<ICalcHistory>>> {
        return $api.get<Array<ICalcHistory>>('/calculationHistory');
    }
}

