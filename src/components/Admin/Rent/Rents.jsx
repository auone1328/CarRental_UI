import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Rents.css';
import RentTable from './RentTable';
import CarHeader from '../CarEdit/CarHeader';
import axios from 'axios'
import $api from '../../../http';
import RentReport from '../../RentReport';

const Rents = () => {
    const [rents, setRents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Загрузка данных с сервера
    useEffect(() => {
        const fetchRents = async () => {
            try {
                const response = await $api.get("/get_rents");
                const data = await response.data;
                setRents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRents();
    }, []);

    // Фильтрация аренд по статусу
    const closedRents = rents.filter(r => r.isClosed);
    const activeRents = rents.filter(r => !r.isClosed && new Date(r.endDate) >= new Date());
    const pendingRents = rents.filter(r => !r.isClosed && new Date(r.endDate) < new Date());

    // Назначение штрафа
    const handleAddPenalty = () => {
        navigate(`/add-penalty`);
    };

    if (loading) return <div className="loading">Загрузка данных...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;

    return (
        <>
            <CarHeader headerText={"Админ-панель"} previous={"/admin"}/>
            <div className="rentals-dashboard">
                <h1>Управление арендами</h1>
                
                <RentTable 
                    title="Активные аренды" 
                    data={activeRents} 
                    rents={rents}
                    setRents={setRents}
                />
                
                <RentTable 
                    title="Ожидающие закрытия" 
                    data={pendingRents} 
                    showActions={true} 
                    rents={rents}
                    setRents={setRents}
                />
                
                <RentTable 
                    title="Закрытые аренды" 
                    data={closedRents} 
                    rents={rents}
                    setRents={setRents}
                />
            </div>
            <div className='rentals-dashboard '>
                <RentReport/>
            </div>         
        </>     
    );
};

export default Rents;