import { makeAutoObservable } from "mobx";
import { IUser } from "../models/types/IUser";
import AuthService from "../services/authService";

export default class Store {
    user = {} as IUser;
    isAuth = false;

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    async login(email: string, password: string) {
        try {
            const {data} = await AuthService.login(email, password);
            localStorage.setItem('accessToken', data.accessToken);
            this.setAuth(true);
            this.setUser(data.user);
        } catch (error) {
            console.log(error)
        }
    }

    async register(email: string, password: string) {
        try {
            const {data} = await AuthService.register(email, password);
            localStorage.setItem('accessToken', data.accessToken);
            this.setAuth(true);
            this.setUser(data.user);
        } catch (error) {
            console.log(error)
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('accessToken')
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (error) {
            console.log(error)
        }
    }
}