import $api from "../http/index.js"

export default class AuthService {
    static async login(email, password) {
        return $api.post('/login', {Email: email, Password: password})
    }

}