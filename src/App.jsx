import { useState, useContext, useEffect } from 'react'
import Header from './components/Header.jsx'
import Button from './components/Button.jsx'
import { Context } from './main.jsx' 
import {observer} from "mobx-react"
import './App.css'

function App() {
  const {auth} = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      auth.checkAuth()
    }
  }, [])

  if (auth.isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <>    
      <Header/>  
      {auth.isAuth && auth.hasRole("admin") ? <p>АВТОРИЗОВАН</p> : <p>НЕ АВТОРИЗОВАН</p>}
    </>
  )
}

export default observer(App)
