import $api from "../http/index.js"

export default class AuthService {
    static async login(email, password) {
        return $api.post('/login', {Email: email, Password: password})
    }

    static async register(firstName, lastName, patronymic, email, password) {
        return $api.post('/register', {FirstName: firstName, LastName: lastName, Patronymic: patronymic, Email: email, Password: password})
    }
}