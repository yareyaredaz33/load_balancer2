import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import api from '../http/index'
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

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.user.username);
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
        } catch (e: any){
            console.log(e.response?.data?.message);
        }
    }
    async logout(){
        try{
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e: any){
            console.log(e.response?.data?.message);
        }
    }
    async checkAuth() {

        try {

            if (localStorage.getItem('token')){
                this.setAuth(true);
            }


        } catch (e:any) {
            console.log(e.response?.data?.message);
        } finally {

        }
    }
}
