import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import $api from '../../../http';
import './Department.css';
import CarHeader from '../CarEdit/CarHeader';
import '../CarEdit/CarCard.css'

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //Загрузка данных с сервера
    useEffect(() => {
        const fetchDepartments = async () => {
        try {
            const response = await $api.get(`/get_dep`);
            const data = response.data;
            setDepartments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchDepartments();
  }, []);

  // Удаление подразделения
    const handleDelete = async (id) => {
        try {
        const response = await $api.delete(`/remove_dep?departmentId=${id}`);
        // Обновляем список после удаления
        setDepartments(departments.filter(dept => dept.departmentId != id));
        } catch (err) {
            console.error('Ошибка при удалении:', err);
        }
    };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (

        <>
            <CarHeader headerText={"Админ-панель"} previous={"/admin"}/>
            <div className="departments-container">
                <h1>Подразделения</h1>
                <button
                    onClick={async () => {
                        navigate("/departments_edit")           
                    }}
                    type="button"
                    className={`group relative w-[25%] h-[45px] left-[65%] flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                >                        
                    Добавить подразделение
                </button> 
                <table className="departments-table">
                    <thead>
                    <tr>
                        <th>Id</th> 
                        <th>Адрес</th>
                        <th>Телефон</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {departments.map((department) => (
                        <tr key={department.departmentId}>
                        <td>{department.departmentId}</td>
                        <td>{department.address}</td>
                        <td>{department.phoneNumber}</td>
                        <td className="actions-cell">
                            <button 
                                onClick={() => navigate(`/departments_edit`, {
                                    state: {
                                        departmentData: department,
                                        isEdit: true
                                    }
                                })}
                                className="btn btn-danger btn-circle"
                            >
                                <span class="material-symbols-outlined">
                                    edit
                                </span>
                            </button>
                            <button 
                                onClick={() => handleDelete(department.departmentId)}
                                className="btn btn-danger btn-circle"
                            >
                                <span class="material-icons">
                                    delete
                                </span>
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Departments;