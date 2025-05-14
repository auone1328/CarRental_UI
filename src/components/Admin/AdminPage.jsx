import React, { useContext, useEffect } from "react"
import AdminHeader from "./AdminHeader"
import { CarContext } from "../../main"
import Preloader from "../Preloader";
import CarCard from "./CarEdit/CarCard";
import {observer} from "mobx-react"

function AdminPage(){
    const {carEdit} = useContext(CarContext); 

    useEffect(() => {
        const getData = async () => {
            await carEdit.getDataForCards() 
        };

        getData();      
    }, [])

    return (
        <>
            <AdminHeader/>
            <main>
                <div className="m-3 text-center flex justify-center items-center ">
                    <h1>Редактирование объявлений</h1>
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
                                            <CarCard carData={card} isEdit={true}/>
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

export default observer(AdminPage)
