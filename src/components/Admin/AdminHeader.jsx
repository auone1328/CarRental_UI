import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Menu from "../Menu/Menu.jsx"

export default function AdminHeader( { header = "Админ-панель" } ){
    const navigate = useNavigate()
    const [accountMenuActive, setAccountMenuActive] = useState(false) 
    const accountMenuItems = [{value: "Главная", href: "/", requiredRole: "admin"},
                                {value: "Главная", href: "/", requiredRole: "mechanic"},
                                {value: "Добавить автомобиль", href: "/car_edit", requiredRole: "admin"},
                                {value: "Подразделения", href: "/departments", requiredRole: "admin"},
                                {value: "Аренды", href: "/rents", requiredRole: "admin"}                               
                            ]
    

    return (
    <>
        <nav className="navbar bg-dark border-bottom border-bottom-dark" data-bs-theme="dark">    
            <div className="container-fluid">
                <a className="navbar-brand select-none">{header}</a>
                {
                     <div className="account-btn cursor-pointer mr-2" 
                        onClick={() => setAccountMenuActive(!accountMenuActive)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                    </div>
                }   
            </div>        
        </nav>
        <Menu header={"Меню"} items={accountMenuItems} active={accountMenuActive} setActive={setAccountMenuActive}></Menu>
    </>
    )
}