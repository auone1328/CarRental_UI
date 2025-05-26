import React, { useRef, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./CarCard.css"
import { carEdit } from "../../../main"
import $api from "../../../http"

export default function CarCard( {carData, isEdit = false, isService = false} ) {  
    const navigate = useNavigate()
    const infoOpenRef = useRef(null)

    const triggerButtonInfo = () => {
        infoOpenRef.current.click();
    };

    const [maintenance, setMaintenance] = useState('')

    useEffect(() => {
        const getData = async (data) => {
            if (isEdit) {
                try {
                    const response = await $api.get(`/get_maintenance?vinCode=${data.vinCode}`);
                    const maintenanceData = response.data;
                    setMaintenance(maintenanceData)                                
                } catch (err) {
                    console.error(`Ошибка получения: ${err.message}`);
                }                    
           } 
        }   

        getData(carData)
        
    }, [])    

    return (
        <div className="card car-card w-[18rem]" onClick={triggerButtonInfo}>
            {(maintenance.carCondition == "Критически неисправен" && isEdit) && 
                <div className="warning-badge">
                    <svg className="warning-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/></g></svg>
                </div>}
            <img src={`data:${carData.contentType};base64,${carData.data}`} className="card-img-top" alt={`${carData.brand} ${carData.model}`}></img>
            <div className="card-body"> 
                <h5 className="card-title">{carData.brand} {carData.model}</h5>
                <p className="card-text">Стоимость за сутки: {carData.cost}₽</p>
                <div className="btn-section">
                    {
                        !isEdit ? 
                                <button ref={infoOpenRef} className="btn btn-danger relative left-[27%]" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            isService ? 
                                                navigate("/maintenance", {
                                                            state: {
                                                                carData: JSON.parse(JSON.stringify(carData)),                                                    
                                                                isEdit: false                                              
                                                            }
                                                })
                                            : 
                                                navigate("/car_info", {
                                                            state: {
                                                                carData: JSON.parse(JSON.stringify(carData)),                                                    
                                                                isEdit: false,
                                                                maintenance: maintenance
                                                            }
                                                })
                                        }}>
                                        {isService ? "Добавить ТО" : "Подробнее"}
                                </button>                                          
                            
                        :    
                            <>
                                <div className="flex">
                                    <button className="btn btn-danger btn-circle"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate("/car_edit", {
                                                state: {
                                                    carData: JSON.parse(JSON.stringify(carData)),
                                                    header: "Редактирование",
                                                    btnText: "Сохранить",
                                                    isEdit: true
                                                }
                                            })
                                        }}
                                    >                                       
                                        <span class="material-symbols-outlined">
                                            edit
                                        </span>
                                    </button>
                                    <button className="btn btn-danger btn-circle" 
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            await carEdit.removeCar(carData.vinCode)
                                        }}
                                    >          
                                        <span class="material-icons">   
                                            delete
                                        </span>
                                    </button>
                                </div>     
                                <div className="flex m-3 absolute right-0">
                                    <button ref={infoOpenRef} className="btn btn-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate("/car_info", {
                                                state: {
                                                    carData: JSON.parse(JSON.stringify(carData)),                                                    
                                                    isEdit: true
                                                }
                                            })
                                        }}>
                                        Подробнее
                                    </button>
                                </div>
                            </>                      
                    }
                </div>                 
            </div>
        </div>
    )
}