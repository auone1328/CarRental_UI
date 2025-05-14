import React from "react"
import { useContext } from 'react'
import "./Menu.css"
import { Link } from 'react-router'
import { Context } from "../../main.jsx";
import { useNavigate } from 'react-router-dom'


export default function Menu( {header, items, active, setActive} ){
    const {auth} = useContext(Context);
    const navigate = useNavigate()

    return (
        <div className={active ? "menu active" : "menu"} onClick={() => setActive(false)}> 
            <div className="menu_content" onClick={e => e.stopPropagation()}>
                <div className="menu_header">{header}</div>
                <ul>    
                    {items.map((item) => {
                        if (item.requiredRole.toLowerCase() != "none") {
                            if (!auth.hasRole(item.requiredRole)) {
                                return                             
                            }
                        }
                        return (
                            <li key={item.value}>
                                <div className="menu_button" onClick={() => navigate(item.href)}>{item.value}</div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}