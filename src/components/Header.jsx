import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Context} from "../main.jsx";

export default function Header(){
    const navigate = useNavigate()
    const {auth} = useContext(Context);

    return (
    <nav className="navbar bg-dark border-bottom border-bottom-dark" data-bs-theme="dark">    
        <div className="container-fluid">
            <a className="navbar-brand">Аренда автомобилей</a>
            {
                !auth.isAuth ?
                <div className="d-flex" role="button">
                    <button className="btn btn-outline-danger" 
                            style={{margin: 5}}
                            onClick={() => navigate("/register")}>
                        Регистрация
                    </button>
                    <button className="btn btn-danger" 
                            style={{margin: 5}} 
                            onClick={() => navigate("/login")}>
                        Вход
                    </button>          
                </div>
                : <></>
            }   
        </div>
    </nav>
    )
}