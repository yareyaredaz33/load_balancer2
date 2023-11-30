import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import {AuthResponse} from "../models/response/AuthResponse";
import {API_URL} from "../http";
export default class Store{
    user = {} as IUser;
    isAuth = false;

    constructor() {
        makeAutoObservable(this);

    }
    setAuth(bool:boolean){
        this.isAuth = bool;

    }
    setUser(user:IUser){
        this.user = user;
    }
    async login(username:string, password:string){
        try{
            const response = await AuthService.login(username,password);
            console.log(response);
            localStorage.setItem('token', response.data.token);
            this.setUser(response.data.user);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any){
            console.log(e.response?.data?.message);
        }
    }
    async registration(username:string, password:string){
        try{
            const response = await AuthService.registration(username,password);
            console.log(response);
            localStorage.setItem('token', response.data.token);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any){
            console.log(e.response?.data?.message);
        }
    }
    async logout(){
        try{
            const response = await AuthService.logout();
            console.log(response);
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e: any){
            console.log(e.response?.data?.message);
        }
    }
    async checkAuth() {

        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/check-authorization`, {withCredentials: true})


            console.log(response);
            localStorage.setItem('token', response.data.token);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e:any) {
            console.log(e.response?.data?.message);
        } finally {

        }
    }
}