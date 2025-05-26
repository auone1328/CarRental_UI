import { useNavigate } from "react-router-dom"
import "./Rents.css"
import { use, useState, useCallback, useEffect } from "react"
import $api from "../../../http"

// Компонент для отображения таблицы
const PenaltyTable = ({ title, data, showActions = false, rents, setRents }) => {
    const navigate = useNavigate()
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState({});

    return (
        <div className="rental-table-container">
        <h2>{title}</h2>
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}
        {data.length > 0 ? (
            <table className="rental-table">
            <thead>
                <tr>
                    <th>Код аренды</th>
                    <th>Описание штрафа</th>
                    <th>Стоимость штрафа</th>
                </tr>
            </thead>
            <tbody>
                {data.map((data) => {

                    return (
                        <tr key={data.rentId}>
                            <td>{data.rentId}</td>
                            <td>{data.description}</td>
                            <td>{data.cost}</td>                           
                        </tr>
                    )
                })}
            </tbody>
            </table>
        ) : (
            <p className="no-data">Нет данных для отображения</p>
        )}
        </div>
    )
}
        
export default PenaltyTable