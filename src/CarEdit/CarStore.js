
import {makeAutoObservable} from "mobx";
import CarService from "../services/CarService";

export default class CarStore {
    isLoading = false;
    isSuccessful = false;
    carCardsData = [];

    constructor() {
        makeAutoObservable(this);
    }

    setCarCardsData(data) {
        this.carCardsData = structuredClone(data)
    }


    setLoading(bool) {
        this.isLoading = bool;
    }

    setSuccess(bool) {
        this.isSuccessful = bool;
    }

    async addCar(formData) {
        this.setLoading(true);  
        this.setSuccess(false)
        try {
            const response = await CarService.addCar(formData)
            this.setCarCardsData(response.data)  
            this.setSuccess(true)
        } catch (e) {
            console.log(this.isSuccessful)
            this.setSuccess(false)
            console.log(e.response?.data)    
        } finally {
            this.setLoading(false)
        }
    }

    async getDataForCards() {
        this.setLoading(true);
        try {
            const response = await CarService.getDataForCards()
            this.setSuccess(true)
            this.setCarCardsData(response.data)  
        } catch (e) {   
            console.log(e.response?.data)
            this.setSuccess(false)
        } finally {
            this.setLoading(false)
        }
    }

    async removeCar(vinCode) {
        this.setLoading(true);
        try {
            const response = await CarService.removeCar(vinCode)
            this.setSuccess(true)
            this.setCarCardsData(response.data)  
        } catch (e) {   
            this.setSuccess(false)
            console.log(e.response?.data)      
        } finally {
            this.setLoading(false)
        }
    }

    async updateCar(formData) {
        this.setLoading(true);
        this.setSuccess(false)
        try {
            const response = await CarService.updateCar(formData)
            this.setCarCardsData(response.data)  
            this.setSuccess(true)
        } catch (e) {
            console.log(e.response?.data)
            this.setSuccess(false)
        } finally {
            this.setLoading(false)
        }
    }
}