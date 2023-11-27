import {IUser} from "../models/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";

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
            localStorage.setItem('token', response.data.accessToken);
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
            localStorage.setItem('token', response.data.accessToken);
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
}