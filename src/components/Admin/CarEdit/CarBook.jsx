import React, { useState, useRef, useContext, useEffect } from "react"
import { format, addDays, differenceInDays } from "date-fns"; 
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import CarHeader from "./CarHeader"
import FormInput from "./FormInput"
import "./Car.css"
import CarService from "../../../services/CarService"
import {observer} from "mobx-react"
import { CarContext } from "../../../main"
import $api from "../../../http";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./CustomDatePicker.css";
import AuthService from "../../../services/AuthService";
import "./CarBook.css"

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
    type="text"
    className="custom_date_input"
    onClick={onClick}
    value={value}
    readOnly
    ref={ref}
    placeholder="дд/мм/гггг"
  />
));

function CarBook( {isModalOpen, setIsModalOpen, carData} ) {
    
    const [phoneNumber, setPhoneNumber] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [passportData, setPassportData] = useState('')
    const [driverLicenseData, setDriverLicenseData] = useState('')

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [occupiedDates, setOccupiedDates] = useState([]);

    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [rentId, setRentId] = useState('') 

    useEffect(() => {
        const fetchDates = async () => {
        try {
            const response = await $api.get(`/get_occupied_dates?vinCode=${carData.vinCode}`);
            const data = response.data;
            setOccupiedDates(data);
        } catch (err) {
            setError(`Ошибка получения дат: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    fetchDates();
    }, [isModalOpen])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const states = [
            AuthService.getUserIdFromToken(localStorage.getItem('token')),
            phoneNumber,
            carData.vinCode,                                                        
            startDate,
            endDate,
            carData.cost * (startDate && endDate 
                            ? differenceInDays(endDate, startDate) 
                            : 0),
            passportData.trim(),
            driverLicenseData.trim()
        ] 

        const phoneRegex = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
        const documentsRegex = /^\d{4}\s\d{6}$/;
                                                
        if (!phoneRegex.test(phoneNumber)) {
            setError('Введите корректный номер телефона'); 
        }
        else if (!documentsRegex.test(passportData)) {
            setError('Введите корректные пасспортные данные!'); 
        }
        else if (!documentsRegex.test(driverLicenseData)) {
            setError('Введите корректные данные В/У!'); 
        }
        else if (states.some((elem) => !elem)) {
            setError('Заполните все поля!')
        }
        else {
            setError('')                        

            const [ 
                UserId, PhoneNumber, VinCode, StartDate, EndDate, RentCost, PassportData, DriverLicenseData
            ] = states;
                                        
            const rent = {
                UserId, PhoneNumber, VinCode, StartDate, EndDate, RentCost, PassportData, DriverLicenseData
            };

            try {
                const response = await $api.post(`/add_rent`, rent)                           
                setBookingSuccess(true);
                setRentId(response.data)
            } catch (err) {
                setError(`Ошибка добавления: ${err.message}`)
            }
        }
    };

    const isDateOccupied = (date) => {
    return occupiedDates.some(period => {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        return date >= start && date <= end;
    });


};

    return (
        <>
            {/*  Модальное окно для брони*/}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-window">
                        {/* Заголовок и кнопка закрытия */}
                        <div className="modal-header">
                            <h2>Бронирование {carData.brand} {carData.model}</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="close-button"
                            >
                                
                            </button>
                        </div>

                        {/* Тело модального окна*/}
                        <div className="modal-body">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                            {bookingSuccess ? (
                                    <div className="booking-success">
                                        <div className="success-icon">✓</div>
                                        <h3>Автомобиль успешно забронирован!</h3>
                                        <div className="booking-details">
                                            <p><strong>Номер брони (необходимо предъявить администратору):</strong> {rentId}</p>
                                            <p><strong>Автомобиль:</strong> {carData.brand} {carData.model}</p>
                                            <p><strong>Период аренды:</strong> {format(startDate, 'dd.MM.yyyy')} - {format(endDate, 'dd.MM.yyyy')}</p>
                                            <p><strong>Адрес получения:</strong> {carData.departmentAddress}</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setPhoneNumber('')                
                                                setPassportData('')
                                                setDriverLicenseData('')   
                                                setStartDate('')
                                                setEndDate('')
                                                setIsModalOpen(false)}
                                            }
                                            className="submit-button"
                                        >
                                            Закрыть
                                        </button>
                                    </div>
                                )
                            :
                                <form onSubmit={handleSubmit}>
                                    <FormInput inputId={"phoneNumber"} type={"number"} placeHolder={"Номер телефона"} value={phoneNumber} setValue={setPhoneNumber} isDisabled={false}/>
                                    <div className="m-2 w-full">
                                        <label className="m-2">Дата начала:</label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            customInput={<CustomDateInput/>}
                                            minDate={new Date()}
                                            filterDate={(date) => !isDateOccupied(date)} // Блокировка занятых дат
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Выберите дату"
                                            required
                                        />
                                    </div>

                                    <div className="m-2 w-full">
                                        <label className="m-2">Дата окончания:</label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            customInput={<CustomDateInput/>}
                                            minDate={addDays(startDate, 1) || new Date()}
                                            filterDate={(date) => !isDateOccupied(date)} // Блокировка занятых дат
                                            disabled={!startDate}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Выберите дату"
                                            required
                                        />
                                    </div>
                                    <FormInput inputId={"passportData"} type={"text"} placeHolder={"Серия и номер пасспорта"} value={passportData} setValue={setPassportData} isDisabled={false}/>
                                    <FormInput inputId={"driverLicenseData"} type={"text"} placeHolder={"Серия и номер в/у"} value={driverLicenseData} setValue={setDriverLicenseData} isDisabled={false}/>
                                    <div className="form-actions">
                                        <button 
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="cancel-button"
                                        >
                                            Отмена
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="submit-button"
                                            onClick={handleSubmit}
                                        >
                                            Отправить
                                        </button>
                                    </div>
                                </form>
                            }
                            
                        </div>
                    </div>
                </div>     
            )}        
        </>
    )
}

export default observer(CarBook)