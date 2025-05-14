import { useNavigate } from 'react-router-dom'

export default function AdminHeader(){
    const navigate = useNavigate()

    return (
    <>
        <nav className="navbar bg-dark border-bottom border-bottom-dark" data-bs-theme="dark">    
            <div className="container-fluid">
                <a className="navbar-brand select-none">Админ-панель</a>
                {
                    <div className="d-flex" role="button">
                        <button className="btn btn-outline-danger" 
                                style={{margin: 5}}
                                onClick={() => navigate("/")}>
                            На главную
                        </button>         
                        <button className="btn btn-outline-danger" 
                                style={{margin: 5}}
                                onClick={() => navigate("/car_edit")}>
                            Добавить автомобиль 
                        </button>    
                    </div> 
                }   
            </div>
        </nav>
    </>
    )
}