import React, { useState, useRef, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import CarHeader from "../CarEdit/CarHeader";
import FormInput from "../CarEdit/FormInput";
import axios from 'axios'
import $api from '../../../http';

function DepartmentsEdit() {
    const [error, setError] = useState(null); 

    const handleAdd = async (departmentData) => {
        try {
            const response = await $api.post(`/add_dep`, departmentData);
            console.log(response.data)
            return true
        } catch (err) {
            setError(`Ошибка добавления: ${err.message}`);
            return false
        }
    };

    const handleEdit = async (departmentData) => {
        try {
            const response = await $api.put(`/update_dep`, departmentData);
            return true
        } catch (err) {
            setError(`Ошибка добавления: ${err.message}`);
            return false
        }
    };

    const location = useLocation()
    const state = location.state || {}
    const departmentData = state.departmentData
    const isEdit = state.isEdit || false

    const [phoneNumber, setPhoneNumber] = useState(departmentData ? departmentData.phoneNumber.toString() : '')
    const [address, setAddress] = useState(departmentData ? departmentData.address.toString() : '')
    const navigate = useNavigate();

    return (
        <> 
            <CarHeader headerText={"Админ-панель"} previous={"/departments"}/>
            <div className="block text-center">
                <div className="mr-12 ml-12 inline-block justify-center">
                    <div className="m-3 text-center justify-center items-center">
                        <h2>Добавление подразделения</h2>
                    </div>
                    <div className="mt-2 space-y-6 w-2xl">
                        {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                        )}
                        <form className="relative">
                            <FormInput inputId={"phoneNumber"} type={"text"} placeHolder={"Номер телефона подразделения"} value={phoneNumber} setValue={setPhoneNumber} isDisabled={false}/>
                            <FormInput inputId={"address"} type={"text"} placeHolder={"Адрес подразделения"} value={address} setValue={setAddress} isDisabled={false}/>
                            <div className="form-actions">                                   
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault()
                                        const department = isEdit ? {
                                            DepartmentId: departmentData.departmentId,
                                            PhoneNumber: phoneNumber,
                                            Address: address        
                                        } 
                                            : 
                                        {
                                            PhoneNumber: phoneNumber,
                                            Address: address  
                                        }
                                        const isAdd = !isEdit ? await handleAdd(department) : await handleEdit(department)
                                        if (isAdd) navigate("/departments")                                         
                                                                                  
                                    }}
                                    type="submit" 
                                    className={`group relative w-[25%] h-[45px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                                >                        
                                    {isEdit ? 'Сохранить' : 'Добавить'}
                                </button> 
                            </div>
                        </form>
                    </div>
                </div>
            </div>                        
        </>
    )
}

export default DepartmentsEdit