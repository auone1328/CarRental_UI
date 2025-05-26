import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import FormInput from '../Admin/CarEdit/FormInput';
import CarHeader from '../Admin/CarEdit/CarHeader';
import DatePicker from 'react-datepicker';
import "../Admin/CarEdit/CustomDatePicker.css"
import $api from '../../http';

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
    type="text"
    className="custom_date_input !w-[220%] relative left-[-50%]"
    onClick={onClick}
    value={value}
    readOnly
    ref={ref}
    placeholder="дд/мм/гггг"
  />
));

const MechanicForm = ( {} ) => {
    const navigate = useNavigate();
    const [maintenanceDate, setMaintenanceDate] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('');
    const [carCondition, setCarCondition] = useState('');
    const [maintenanceCost, setMaintenanceCost] = useState('');
    const [maintenanceStatus, setMaintenanceStatus] = useState('');

    const [error, setError] = useState(null);

    const location = useLocation()
    const state = location.state || {}
    const carData = state.carData || {}

    const handleAdd = async (e) => {
        e.preventDefault();

        const states = [
            carData.vinCode,
            maintenanceDate,
            maintenanceType.trim(),
            carCondition.trim(),
            maintenanceCost,
            maintenanceStatus.trim()
        ] 

        console.log(states)

        if (states.some((elem) => !elem)) {
            setError('Заполните все поля!')
        } 
        else {
            setError('')                        

            const [ 
                VinCode, MaintenanceDate, MaintenanceType, CarCondition, MaintenanceCost, MaintenanceStatus
            ] = states;
                                        
            const maintenance = {
                VinCode, MaintenanceDate, MaintenanceType, CarCondition, MaintenanceCost, MaintenanceStatus
            };

            try {
                const response = await $api.post(`/add_maintenance`, maintenance)  
                navigate("/service")                         
            } catch (err) {
                setError(`Ошибка добавления: ${err.message}`)
            }
        }
    };

    return (
        <>
            <CarHeader headerText={"Сервис"} previous={"/service"}/>
            <div className="penalty-form block text-center">
                <div className="mr-12 ml-12 inline-block justify-center">
                    <h2>Технический осмотр {carData.brand} {carData.model} {carData.licensePlate}</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <form>
                        <div className="m-2">
                            <label className="m-2 relative left-[-20%]">Дата осмотра:</label>
                            <DatePicker                             
                                selected={maintenanceDate}
                                onChange={(date) => setMaintenanceDate(date)}
                                customInput={<CustomDateInput/>}
                                maxDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Выберите дату"
                                required
                            />
                        </div> 
                        <select 
                                className={`${!maintenanceType ? "text-gray-500" : ""} m-2 rounded-none relative block w-[98%] px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-xl focus:outline-none! focus:ring-red-500! focus:border-red-500! focus:z-10!`}
                                value={maintenanceType}
                                onChange={(e) => setMaintenanceType(e.target.value)}
                            >
                                <option value="" disabled hidden>Тип обслуживания</option>
                                
                                <option value={"Замена расходников"}>
                                    Замена расходников  
                                </option>
                                <option value={"Ремонт"}>
                                    Ремонт
                                </option>                
                        </select> 
                        <select 
                                className={`${!carCondition ? "text-gray-500" : ""} m-2 rounded-none relative block w-[98%] px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-xl focus:outline-none! focus:ring-red-500! focus:border-red-500! focus:z-10!`}
                                value={carCondition}
                                onChange={(e) => setCarCondition(e.target.value)}
                            >
                                <option value="" disabled hidden>Состояние автомобиля</option>
                                
                                <option value={"Исправен"}>
                                    Исправен 
                                </option>
                                <option value={"Исправен, некритические повреждения"}>
                                    Исправен, некритические повреждения
                                </option>           
                                <option value={"Критически неисправен"}>
                                    Критически неисправен
                                </option>      
                        </select> 
                        <FormInput inputId={"maintenanceCost"} type={"number"} placeHolder={"Стоимость обслуживания"} value={maintenanceCost} setValue={setMaintenanceCost} isDisabled={false}/> 
                        <select 
                                className={`${!maintenanceStatus ? "text-gray-500" : ""} m-2 rounded-none relative block w-[98%] px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-xl focus:outline-none! focus:ring-red-500! focus:border-red-500! focus:z-10!`}
                                value={maintenanceStatus}
                                onChange={(e) => setMaintenanceStatus(e.target.value)}
                            >
                                <option value="" disabled hidden>Статус обслуживания</option>
                                
                                <option value={"Завершено"}>
                                    Завершено 
                                </option>
                                <option value={"В процессе"}>
                                    В процессе
                                </option>           
                                <option value={"В очереди"}>
                                    В очереди
                                </option>      
                        </select> 
                        <button
                            onClick={handleAdd}
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

export default MechanicForm;