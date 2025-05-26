// components/RentalReportExport.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { Button, Form, Space, message } from 'antd';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import $api from '../http';
import "./Admin/CarEdit/CustomDatePicker.css"
import { format, addDays, differenceInDays } from "date-fns"; 

const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
  <input
    type="text"
    className="custom_date_input"
    onClick={onClick}
    value={value}
    readOnly
    ref={ref}
    placeholder={"дд/мм/гггг"}
  />
));

const RentReport = () => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);

            const response = await $api.get(`/rents/excel`, {
                responseType: 'blob',
            });
            
            const filename = response.headers['content-disposition']
                ? response.headers['content-disposition'].split('filename=')[1]
                : `rentals_report_${new Date().toISOString()}.xlsx`;
            
            saveAs(new Blob([response.data]), filename);
            message.success('Отчёт успешно выгружен');
        } catch (error) {
            message.error('Произошла ошибка при выгрузке отчёта');
            console.error('Export error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
        <h2>Выгрузка отчёта по арендам</h2>
            <Button 
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }} 
                onClick={handleExport}
                loading={loading}
            >
                Выгрузить в Excel
            </Button>
    </div>
  );
};

export default RentReport;