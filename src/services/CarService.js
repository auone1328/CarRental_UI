import { API_URL } from "../http/index.js"
import axios from 'axios'
import $api from "../http/index.js"

export default class CarService {
    static async addCar(formData) {
        return await $api.post(`/car_add`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',    
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    static async getDataForCards() {
        return await $api.get(`/get_data_for_cars`)
    }

    static async removeCar(vinCode) {
        return await $api.delete(`/remove_car`, {data: {vinCode}})
    }

    static async updateCar(formData) {
        return await $api.put(`/update_car`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',    
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
    }
}