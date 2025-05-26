import React, { useContext, useEffect } from "react"
import AdminHeader from "../Admin/AdminHeader";
import { CarContext } from "../../main";
import Preloader from "../Preloader";
import CarCard from "../Admin/CarEdit/CarCard";
import {observer} from "mobx-react"

function ServicePage(){
    const {carEdit} = useContext(CarContext); 

    useEffect(() => {
        const getData = async () => {
            await carEdit.getDataForCards() 
        };

        getData();      
    }, [])

    return (
        <>
            <AdminHeader header={"Сервис"}/>
            <main>
                <div className="m-3 text-center flex justify-center items-center ">
                    <h1>Автомобили для ТО</h1>
                </div>
                <section className="ml-20 mr-20 flex">
                    <div className="container text-center">
                        <div className="row">
                            {carEdit.isLoading ? 
                                <Preloader/> 
                            :   
                                carEdit.carCardsData.map((card) => {
                                    return (
                                        <li className="mb-4 list-none col-xl-3 col-lg-4 col-md-6 col-sm-12" key={card.vinCode}>
                                            <CarCard carData={card} isEdit={false} isService={true}/>
                                        </li>                                  
                                    )
                                })   
                            }
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default observer(ServicePage)
