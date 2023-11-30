// CalcService.js
import $api from '../http';
import { AxiosResponse } from 'axios';

export default class CalcService {
    static async calculatePi(numberOfDigits: number): Promise<AxiosResponse<{ content: string }>> {
        return $api.post<{ content: string }>(`/calculatePi?numberOfDigits=${numberOfDigits}`);
    }
}