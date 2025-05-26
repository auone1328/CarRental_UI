import React, { useState, useRef, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import CarHeader from "./CarHeader"
import FormInput from "./FormInput"
import "./Car.css"
import CarService from "../../../services/CarService"
import $api from "../../../http";
import {observer} from "mobx-react"
import { CarContext } from "../../../main"

function base64ToFile(base64String, filename, mimeType) {
    // Преобразуем Base64 в бинарные данные
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    // Создаем Blob и затем File
    const blob = new Blob(byteArrays, { type: mimeType });  
    return new File([blob], filename, { type: mimeType });
  }


const defaultCarData = {
    vinCode: "", brand: "", model: "", releaseYear: "", enginePower: "", 
    engineVolume: "", engineType: "", transmissionType: "", 
    seatsNumber: "", drive: "", cost: "", licensePlate: "", image: null, imageTitle: "", departmentId: ""
};

function CarForm() {
    const {carEdit} = useContext(CarContext);
    const navigate = useNavigate()

    const location = useLocation();
    const state = location.state || {};

    const carData = state?.carData || defaultCarData
    const header = state?.header || "Добавление"
    const btnText = state?.btnText || "Добавить"
    const isEdit = state?.isEdit || false

    const [error, setError] = useState('');
    const [isImageEdit, setIsImageEdited] = useState(isEdit)
    const [departments, setDepartments] = useState([]);

    const [vinCode, setVinCode] = useState(carData.vinCode.toString());
    const [brand, setBrand] = useState(carData.brand.toString());
    const [model, setModel] = useState(carData.model.toString());
    const [year, setYear] = useState(carData.releaseYear.toString());
    const [enginePower, setEnginePower] = useState(carData.enginePower.toString());
    const [engineVolume, setEngineVolume] = useState(carData.engineVolume.toString());
    const [engineType, setEngineType] = useState(carData.engineType.toString());
    const [transmissionType, setTransmissionType] = useState(carData.transmissionType.toString());
    const [seatsNumber, setSeatsNumber] = useState(carData.seatsNumber.toString());
    const [drive, setDrive] = useState(carData.drive.toString());
    const [cost, setCost] = useState(carData.cost.toString());
    const [licensePlate, setLicensePlate] = useState(carData.licensePlate.toString())
    const [departmentId, setDepartmentId] = useState(carData.departmentId.toString())
    //для добавления изображения авто
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(carData.data);
    const fileInputRef = useRef(null);

    useEffect(() => {
        return () => {
          if (file) {
            URL.revokeObjectURL(file);
          }
        };
    }, [file]);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await $api.get(`/get_dep`)
                setDepartments(response.data)
            } catch (err) {
                setError(`Ошибка при получении данных: ${err}`)
            }
        };
        getData();      
    }, [])

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files) => {
        const selectedFile = files[0];
        // Проверка типа файла
        if (!selectedFile.type.match('image.*')) {           
            setError('Пожалуйста, выберите изображение');
            return;
        }
        else if (selectedFile.size > 5 * 1024 * 1024) { 
            alert('Файл слишком большой. Максимальный размер: 5MB');
            return;
        }
        else {
            setError('');
        }
        setFile(selectedFile);
        if (isEdit) {
            setIsImageEdited(!isImageEdit);
        }       
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <CarHeader headerText={"Админ-панель"} previous={"/admin"}/>    
            <main className="block text-center"> 
                <div className="m-3 text-center justify-center items-center">
                    <h1>{header} объявления</h1>  
                </div>
                <section className="mr-12 ml-12 inline-block justify-center">
                    <div>
                        {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="flex flex-col sm:inline">{error}</span>
                        </div>
                        )}
                    </div>
                    <form className="mt-2 space-y-6 w-2xl">
                        <div className="relative">
                            <FormInput inputId={"vinCode"} type={"text"} placeHolder={"VIN-номер"} value={vinCode} setValue={setVinCode} isDisabled={isEdit}/> 
                            <FormInput inputId={"brand"} type={"text"} placeHolder={"Марка"} value={brand} setValue={setBrand}/>                                
                            <FormInput inputId={"model"} type={"text"} placeHolder={"Модель"} value={model} setValue={setModel}/>      
                            <FormInput inputId={"year"} type={"number"} placeHolder={"Год выпуска"} value={year} setValue={setYear}/>     
                            <FormInput inputId={"enginePower"} type={"number"} placeHolder={"Мощность двигателя"} value={enginePower} setValue={setEnginePower}/>      
                            <FormInput inputId={"engineVolume"} type={"text"} placeHolder={"Объём двигателя"} value={engineVolume} setValue={setEngineVolume}/>    
                            <select 
                                className={`${!engineType ? "text-gray-500" : ""} m-2 rounded-none relative block w-[98%] px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-xl focus:outline-none! focus:ring-red-500! focus:border-red-500! focus:z-10!`}
                                value={engineType}
                                onChange={(e) => setEngineType(e.target.value)}
                            >
                                <option value="" disabled hidden>Тип двигателя</option>
                                
                                <option value={"Бензиновый"}>
                                    Бензиновый  
                                </option>
                                <option value={"Дизельный"}>
                                    Дизельный
                                </option>                   
                            </select> 
                            <select 
                                className={`${!transmissionType ? "text-gray-500" : ""} m-2 rounded-none relative block w-[98%] px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-xl focus:outline-none! focus:ring-red-500! focus:border-red-500! focus:z-10!`}
                                value={transmissionType}
                                onChange={(e) => setTransmissionType(e.target.value)}
                            >
                                <option value="" disabled hidden>Тип трансмиссии</option>
                                
                                <option value={"Автомат"}>
                                    Автомат  
                                </option>
                                <option value={"Вариатор"}>
                                    Вариатор
                                </option>              
                                <option value={"Робот"}>
                                    Робот
                                </option>        
                                <option value={"Механика"}>
                                    Механика
                                </option>    
                            </select> 
                            <FormInput inputId={"seatsNumber"} type={"number"} placeHolder={"Количество сидений"} value={seatsNumber} setValue={setSeatsNumber}/>
                            <select 
                                className={`${!drive ? "text-gray-500" : ""} m-2 rounded-none relative block w-[98%] px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-xl focus:outline-none! focus:ring-red-500! focus:border-red-500! focus:z-10!`}
                                value={drive}
                                onChange={(e) => setDrive(e.target.value)}
                            >
                                <option value="" disabled hidden>Привод</option>
                                
                                <option value={"Полный"}>
                                    Полный  
                                </option>
                                <option value={"Задний"}>
                                    Задний
                                </option>              
                                <option value={"Передний"}>
                                    Передний
                                </option>        
                            </select> 
                            <FormInput inputId={"cost"} type={"number"} placeHolder={"Стоимость"} value={cost} setValue={setCost}/>
                            <FormInput inputId={"licensePlate"} type={"text"} placeHolder={"Регистрационный номер"} value={licensePlate} setValue={setLicensePlate}/> 
                            <select 
                                className={`${!departmentId ? "text-gray-500" : ""} m-2 rounded-none relative block w-[98%] px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-xl focus:outline-none! focus:ring-red-500! focus:border-red-500! focus:z-10!`}
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                            >
                                <option value="" disabled hidden>Подразделение</option>
                                {departments.map(option => (
                                    <option key={option.departmentId} value={option.departmentId}>
                                        {option.address}
                                    </option>
                                ))}
                            </select>  
                            {/*drag&drop изображение*/}
                            <div className="file-drop-container">
                                <input  
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden-input"
                                />
                                
                                <div
                                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                                    onClick={triggerFileInput} 
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="drop-content">
                                    {file ? (
                                        <div className="file-info">                                     
                                        {!isImageEdit ? file.type.match('image.*') && (
                                            <>
                                                <p>Выбран файл: {file.name}</p>
                                                <img 
                                                src={URL.createObjectURL(file)} 
                                                alt="Preview" 
                                                className="preview-image"
                                                /> 
                                            </>
                                        ) : 
                                            <>                                               
                                                <p>Выбран файл: {carData.title}</p>
                                                <img 
                                                src={`data:${carData.contentType};base64,${file}`} 
                                                alt="Preview" 
                                                className="preview-image"/>          
                                            </>
                                        }
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="upload-icon" viewBox="0 0 24 24">
                                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                            </svg>
                                            <p>Изображение-авто: Перетащите файл сюда или кликните для выбора</p>
                                        </>
                                    )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    let baseToFile = null;
                                    if (isEdit && isImageEdit) {
                                        baseToFile = base64ToFile(file, carData.title, carData.contentType)                             
                                    }
                                    
                                    const states = [vinCode.trim(),
                                                brand.trim(),
                                                model.trim(),
                                                year.trim(), 
                                                enginePower.trim(),
                                                engineVolume.trim(),
                                                engineType.trim(),
                                                transmissionType.trim(),
                                                seatsNumber.trim(),
                                                drive.trim(),
                                                cost.trim(),
                                                licensePlate.trim(),
                                                baseToFile ?? file,
                                                (isEdit && isImageEdit) ? carData.title : file.name,
                                                departmentId]
                                    const carNumberRegex = /^[АВЕКМНОРСТУХA-Z]\d{3}[АВЕКМНОРСТУХA-Z]{2}\d{2,3}$/i;
                                    const engineVolumeRegex = /^\d{1,2}\.\d{1,2}$/;
                                    
                                    if (engineVolumeRegex.test(engineVolume)) {
                                        setError('Неправильный формат объёма двигателя!')
                                    }
                                    else if (carNumberRegex.test(licensePlate)) {
                                        setError('Неправильный формат регистрационного номера!')
                                    }
                                    else if (states.some((elem) => !elem)) {
                                        setError('Заполните все поля!')
                                    } 
                                    else {
                                        setError('')                        

                                        const [ 
                                            VinCode, Brand, Model, ReleaseYear, EnginePower, 
                                            EngineVolume, EngineType, TransmissionType, 
                                            SeatsNumber, Drive, Cost, LicensePlate, Image, ImageTitle, DepartmentId
                                        ] = states;
                                        
                                        const car = {
                                            VinCode, Brand, Model, ReleaseYear, EnginePower, 
                                            EngineVolume, EngineType, TransmissionType, 
                                            SeatsNumber, Drive, Cost, LicensePlate, Image, ImageTitle, DepartmentId
                                        };

                                        const formData = new FormData();
                                        for ( var key in car ) {
                                            formData.append(key, car[key]);
                                        }

                                        (!isEdit) ? await carEdit.addCar(formData) : await carEdit.updateCar(formData)
                                        console.log(carEdit.isSuccessful)
                                        if (carEdit.isSuccessful) {
                                            navigate("/admin")
                                        }
                                        else {
                                            setError('Недопустимый формат файла!');
                                        }
                                    }                       
                                }}
                                type="button"
                                disabled={carEdit.isLoading}    
                                className={`group absolute w-[20%] h-[45px] left-[75%] flex justify-center m-2 py-2 px-4 border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${carEdit.isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                            {carEdit.isLoading ? (
                                <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                </>
                            ) : btnText}
                            </button>                      
                        </div>
                    </form>
                </section>
            </main>
        </>
    )
}

export default observer(CarForm)