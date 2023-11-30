import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
export const API_URL = `http://localhost:5000/auth`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

/*$api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/login`, {withCredentials: true})
            localStorage.setItem('token', response.data.token);
            return $api.request(originalRequest);
        } catch (e) {
            console.log('НЕ авторизований')
        }
    }
    throw error;
})*/
$api.interceptors.request.use((config) => {


    const token = localStorage.getItem('token');

    if (token) {
        console.log("token set")
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export default $api;
