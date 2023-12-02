import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
export const API_URL = `http://localhost:4001/auth`

const $api = axios.create({
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})



export default $api;
