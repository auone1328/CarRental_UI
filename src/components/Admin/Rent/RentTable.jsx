import { useNavigate } from "react-router-dom"
import "./Rents.css"
import { use, useState, useCallback, useEffect } from "react"
import $api from "../../../http"


// Компонент для отображения таблицы
const RentTable = ({ title, data, showActions = false, rents, setRents }) => {
    const navigate = useNavigate()
    const [carData, setCarData] = useState({})
    const [userData, setUserData] = useState({})
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState({});

    useEffect(() => {
        if (data && data.length > 0) {
            data.forEach(rent => {
                if (rent.vinCode && !carData[rent.vinCode]) {
                    fetchCarData(rent.vinCode);
                    fetchUserData(rent.userId)
                }
            });
        }
    }, [data]);

    const fetchCarData = useCallback(async (vinCode) => {
        try {
            setLoading(prev => ({...prev, [vinCode]: true}));
            const response = await $api.get(`/get_car`, {params: {
                                            vinCode: vinCode 
                                        }})
            setCarData(prev => ({...prev, [vinCode]: response.data}));
        } catch (err) {
            setError(`Ошибка при загрузке данных авто (VIN: ${vinCode})`);
        } finally {
            setLoading(prev => ({...prev, [vinCode]: false}));
        }
    }, [carData])


    const fetchUserData = useCallback(async (userId) => {
        try {
            setLoading(prev => ({...prev, [userId]: true}));
            const response = await $api.get(`/get_user`, {params: {
                                            userId: userId 
                                        }})
            setUserData(prev => ({...prev, [userId]: response.data}));
        } catch (err) {
            setError(`Ошибка при загрузке данных(${userId})`);
        } finally {
            setLoading(prev => ({...prev, [userId]: false}));
        }
    }, [userData])
    
    const handleCloseRent = async (rentId) => {
        try {
            const response = await $api.post(`/close_rent?rentId=${rentId}`)
            // Обновляем список аренд
            const updatedRents = rents.map(r => 
                r.rentId === rentId ? { ...r, isClosed: true } : r
            )
            setRents(updatedRents);
        } catch (err) {
            setError('Ошибка:', err.message);
        }
    };

    return (
        <div className="rental-table-container">
        <h2>{title}</h2>
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {data.length > 0 ? (
            <table className="rental-table">
            <thead>
                <tr>
                <th>Код аренды</th>
                <th>ФИО клиента</th>
                <th>Телефон</th>
                <th>Автомобиль</th>
                <th>Регистрационный номер</th>               
                <th>Начало</th>
                <th>Конец</th>
                <th>Паспорт</th>
                <th>Водительское</th>
                <th>Стоимость</th>
                {showActions && <th>Действия</th>}
                </tr>
            </thead>
            <tbody>
                {data.map((rent) => {
                    const currentCar = carData[rent.vinCode];
                    const currentUser = userData[rent.userId];

                    return (
                        <tr key={rent.rentId}>
                            <td>{rent.rentId}</td>
                            <td>
                                {loading[rent.userId] ? (
                                    'Загрузка...'
                                ) : currentUser ? (
                                    `${currentUser.lastName} ${currentUser.firstName} ${currentUser.patronymic}`
                                ) : (
                                    'Не удалось загрузить'
                                )}
                            </td>
                            <td>{rent.phoneNumber}</td>                           
                            <td>
                                {loading[rent.vinCode] ? (
                                    'Загрузка...'
                                ) : currentCar ? (
                                    `${currentCar.brand} ${currentCar.model}`
                                ) : (
                                    'Не удалось загрузить'
                                )}
                            </td>
                            <td>
                                {loading[rent.vinCode] ? (
                                    'Загрузка...'
                                ) : currentCar ? (
                                    `${currentCar.licensePlate}`
                                ) : (
                                    'Не удалось загрузить'
                                )}
                            </td>
                            <td>{new Date(rent.startDate).toLocaleDateString()}</td>
                            <td>{new Date(rent.endDate).toLocaleDateString()}</td>
                            <td>{rent.passportData}</td>
                            <td>{rent.driverLicenseData}</td>
                            <td>{rent.rentCost.toLocaleString()} ₽</td>
                            {showActions && (
                                <td className="actions">
                                    <button 
                                    onClick={() => {handleCloseRent(rent.rentId)}}
                                    className="action-btn close-btn"
                                    >
                                        Закрыть
                                    </button>
                                    <button 
                                    onClick={() => {navigate("/penalty", 
                                        {state: 
                                            {
                                                rentData: rent,
                                                userData: userData
                                            }
                                        }
                                    )}}
                                    className="action-btn penalty-btn"
                                    >
                                        Штраф
                                    </button>
                                </td>
                            )}
                        </tr>
                    )
                })}
            </tbody>
            </table>
        ) : (
            <p className="no-data">Нет данных для отображения</p>
        )}
        </div>
    )
}
        
export default RentTable