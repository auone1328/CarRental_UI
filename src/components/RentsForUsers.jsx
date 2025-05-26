import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Admin/Rent/Rents.css"
import RentTable from './Admin/Rent/RentTable';
import CarHeader from './Admin/CarEdit/CarHeader';   
import axios from 'axios'
import $api from '../http';
import AuthService from '../services/AuthService';
import PenaltyTable from './Admin/Rent/PenaltyTable';

const RentsForUsers = () => {
    const [rents, setRents] = useState([]);
    const [penalties, setPenalties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Загрузка данных с сервера
    useEffect(() => {
        const fetchRentsAndPenalties = async () => {
            try {
                const userId = AuthService.getUserIdFromToken(localStorage.getItem('token'))
                const response1 = await $api.get(`/get_user_rents?userId=${userId}`);
                const response2 = await $api.get(`/get_user_penalties?userId=${userId}`);
                const data1 = response1.data;  
                const data2 = response2.data;           
                setRents(data1);
                setPenalties(data2);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRentsAndPenalties();
    }, []);

    if (loading) return <div className="loading">Загрузка данных...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <>
            <CarHeader headerText={"Аренда автомобилей"} previous={"/"}/>
            <div className="rentals-dashboard">
                <h1>Аренды</h1>
                
                {
                    rents.length != 0 ?
                        <RentTable 
                            title="Ваши аренды" 
                            data={rents} 
                        /> 
                    : <h3>У вас ещё нет аренд.</h3>
                }

                <h1>Штрафы</h1>    
                {
                    penalties.length != 0 ?
                        <>
                            <PenaltyTable 
                                title="Ваши штрафы" 
                                data={penalties} 
                            /> 
                            <h5>Для оплаты штрафов свяжитесь с администратором по номеру: 89223159094</h5>
                        </>
                    : <h3>У вас ещё нет штрафов.</h3>
                }  
            </div>
        </>     
    );
};

export default RentsForUsers;