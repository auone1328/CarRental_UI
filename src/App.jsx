import { useState, useContext, useEffect } from 'react'
import Header from './components/Header.jsx'
import Button from './components/Button.jsx'
import { Context } from './main.jsx' 
import {observer} from "mobx-react"
import './App.css'
import Banner from './components/Banner/Banner.jsx'
import { CarContext } from "./main.jsx"
import CarCard from './components/Admin/CarEdit/CarCard.jsx'
import Preloader from './components/Preloader.jsx'
import $api from './http/index.js'

function App() {
  const {auth} = useContext(Context);

  const {carEdit} = useContext(CarContext); 

  const [malfunctions, setMalfunctions] = useState({})
  
  useEffect(() => {
      const getData = async () => {
        await carEdit.getDataForCards() 
      };
  
      getData();      
  }, [auth.isAuth])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      auth.checkAuth()
    }
  }, [])
  
  useEffect(() => {
    if (carEdit.carCardsData.length > 0) {
      const checkAllMalfunctions = async () => {
        const malfunctionsMap = {};
        for (const card of carEdit.carCardsData) {
          malfunctionsMap[card.vinCode] = await checkMalfunction(card.vinCode);
        }
        setMalfunctions(malfunctionsMap);
      };
      checkAllMalfunctions();
    }
  }, [carEdit.carCardsData]);

  const checkMalfunction = async (vinCode) => {
    try {
      if (vinCode) {
        const response = await $api.get(`/get_maintenance?vinCode=${vinCode}`);
        console.log(response.data)
        return response.data.carCondition === "Критически неисправен";
      }
      return false;
    } catch (err) {
      console.error('Ошибка при получении данных:', err);
      return false;
    }
  };

  if (auth.isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <>    
      <Header/>  
      {auth.isAuth ? 
        <>
          <main>
              <div className="mb-3 mt-20 text-center block justify-center items-center">
                  <h1>Автомобили для бронирования</h1>
                  <h5>Выберите подходящий автомобиль и арендуйте его на любой 
                  срок по лучшей цене в городе!</h5>
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
                                    {!malfunctions[card.vinCode] && <CarCard carData={card} isEdit={false}/>} 
                                  </li>                                  
                                )
                              })   
                          }
                      </div>
                  </div>
              </section>
          </main>
        </>    
      :
        <Banner/>
      }
    </>
  )
}

export default observer(App)
