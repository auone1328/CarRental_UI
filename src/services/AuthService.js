import $api from "../http/index.js"

export default class AuthService {
    static async login(email, password) {
        return $api.post('/login', {Email: email, Password: password})
    }

    static async register(firstName, lastName, patronymic, email, password) {
        return $api.post('/register', {FirstName: firstName, LastName: lastName, Patronymic: patronymic, Email: email, Password: password})
    }

    static getRolesFromToken = (jwt) => {
        try {
            if (!jwt) return [];
          
            // Декодируем JWT
            let jwtData = jwt.split('.')[1]
            let decodedJwtJsonData = window.atob(jwtData)
            
            const decoded = JSON.parse(decodedJwtJsonData);
                    
            // Стандартный claim для роли
            const roleClaimType = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    
            // Получаем роль
            return decoded[roleClaimType] || null;
        }
        catch (e) {
            console.error('Error decoding token:', e);
            return [];
        }  
    }   

    static getUserIdFromToken = (jwt) => {
        try {
            if (!jwt) return [];
          
            // Декодируем JWT
            let jwtData = jwt.split('.')[1]
            let decodedJwtJsonData = window.atob(jwtData)
            
            const decoded = JSON.parse(decodedJwtJsonData);
                    
            return decoded.userId || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        }
        catch (e) {
            console.error('Error decoding token:', e);
            return [];
        }  
    }   
}