import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import FormInput from '../CarEdit/FormInput';
import CarHeader from '../CarEdit/CarHeader';
import $api from '../../../http';

const AddPenalty = () => {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');

    const [error, setError] = useState(null);

    const location = useLocation()
    const state = location.state || {}
    const rentData = state.rentData || {}
    const userData = state.userData[rentData.userId] || {}

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await $api.post(`/add_penalty`, {RentId: rentData.rentId, Description: description, Cost: cost})
            navigate("/rents")
        } catch (err) {
            setError('Ошибка:', err.message);
        }
    };

    return (
        <>
            <CarHeader headerText={"Админ-панель"} previous={"/rents"}/>
            <div className="penalty-form block text-center">
                <div className="mr-12 ml-12 inline-block justify-center">
                    <h2>Назначение штрафа для аренды:</h2>  
                    <h2>{`(${rentData.rentId})`} {userData.lastName} {userData.firstName} {userData.patronymic}</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <FormInput inputId={"description"} type={"text"} placeHolder={"Описание штрафа"} value={description} setValue={setDescription} isDisabled={false}/> 
                        <FormInput inputId={"cost"} type={"number"} placeHolder={"Стоимость штрафа"} value={cost} setValue={setCost} isDisabled={false}/> 
            
                        <button
                            type="submit" 
                            className={`group relative w-[25%] h-[45px] left-[70%] flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                        >                        
                            Добавить
                        </button> 
                    </form>
                </div>
            </div>
        </>    
    );
};

export default AddPenalty;