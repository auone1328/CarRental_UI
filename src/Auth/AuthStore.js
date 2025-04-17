import axios from 'axios';
import {makeAutoObservable} from "mobx";
import AuthService from "../services/AuthService";
import { API_URL } from "../http/index";

export default class AuthStore {
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool) {
        this.isAuth = bool;
    }

    setUser(user) {
        this.user = user;
    }

    setLoading(bool) {
        this.isLoading = bool;
    }

    async login(email, password) {
        this.setLoading(true);
        try {
            const response = await AuthService.login(email, password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
        } catch (e) {
            console.log(e.response?.data)
        } finally {
            this.setLoading(false)
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);  
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
        } catch (e) {
            console.log(e.response?.data?.message); 
        } finally {
            this.setLoading(false);
        }
    }
}