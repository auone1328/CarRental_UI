import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CarHeader( { headerText, previous = "/"} ){
    const navigate = useNavigate()

    return (
    <>
        <nav className="navbar bg-dark border-bottom border-bottom-dark" data-bs-theme="dark">    
            <div className="container-fluid">
                <a className="navbar-brand select-none">{headerText}</a>
                {
                    <div className="d-flex" role="button">
                        <button className="btn btn-outline-danger" 
                                style={{margin: 5}}
                                onClick={() => navigate(previous)}>
                            Назад
                        </button>           
                    </div> 
                }   
            </div>
        </nav>
    </>
    )
}