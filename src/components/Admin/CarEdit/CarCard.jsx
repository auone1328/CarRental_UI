import React, { useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./CarCard.css"
import { carEdit } from "../../../main"

export default function CarCard( {carData, isEdit = false} ) {  
    const navigate = useNavigate()
    const infoOpenRef = useRef(null)

    const triggerButtonInfo = () => {
        infoOpenRef.current.click();
    };

    return (
        <div className="card car-card w-[18rem]" onClick={triggerButtonInfo}>
            <img src={`data:${carData.contentType};base64,${carData.data}`} className="card-img-top" alt={`${carData.brand} ${carData.model}`}></img>
            <div className="card-body"> 
                <h5 className="card-title">{carData.brand} {carData.model}</h5>
                <p className="card-text">Стоимость за сутки: {carData.cost}₽</p>
                <div className="btn-section">
                    {
                        !isEdit ? 
                            <button ref={infoOpenRef} className="btn btn-danger relative left-[30%]" 
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