import { Navigate } from 'react-router-dom';
import { useContext, useEffect, useState} from 'react';
import { observer } from 'mobx-react';
import { Context } from '../main.jsx';

//Компонент для защиты маршрутов
const ProtectedRoute = observer(({ children, requiredRole }) => {
    const { auth } = useContext(Context);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
          await auth.checkAuth();
          setIsChecking(false);
        };
        
        checkAuth();
      }, []);
    
    if (isChecking) {
        return <div>Загрузка...</div>; 
    }

    if (!auth.isAuth) {
        return <Navigate to="/login" replace />;
    }

    if (!auth.hasRole(requiredRole)) {
        return <Navigate to="/not_found" replace />;
    }
  
    return children;
});

export default ProtectedRoute;