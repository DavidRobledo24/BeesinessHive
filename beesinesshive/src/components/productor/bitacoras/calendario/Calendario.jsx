import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css"
import './calendario.css';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";



const Calendario = ({ onDaySelect }) => {
    registerLocale("es", es);
    setDefaultLocale("es");
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        onDaySelect(date); // Enviamos la fecha seleccionada al componente padre (BitacoraColmena)
    };

    const festivos = [
        "01-01", // Año Nuevo
        "01-08", // Día de los Reyes Magos
        "03-25", // Día de San José
        "03-28", // Jueves Santo
        "03-29", // Viernes Santo
        "03-31", // Domingo de Resurrección
        "05-01", // Día de Trabajo
        "05-13", // Día de la Ascensión
        "06-03", // Corpus Christi
        "06-10", // Día del Sagrado Corazón
        "07-01", // San Pedro y San Pablo
        "07-20", // Día de la Independencia
        "08-07", // Día de la Batalla de Boyacá
        "08-19", // La asunción de la Virgen
        "10-14", // Día de la Raza
        "11-04", // Día de Todos los Santos
        "11-11", // Independencia de Cartagena
        "12-08", // Día de la Inmaculada Concepción
        "12-25"  // Día de Navidad
    ];

    const highlightDates = (date) => {
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return festivos.includes(formattedDate);
    };

    const dayClassName = (date) => {
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
        const isSunday = date.getDay() === 0; // 0 representa los domingos

        if (isSelected) {
            return "react-datepicker__day--selected";
        } else if (highlightDates(date)) {
            return "react-datepicker__day--highlighted";
        } else if (isSunday) {
            return "react-datepicker__day--highlighted-sunday";
        } else {
            return undefined;
        }
    };

    return (
        <div>
            <DatePicker
                inline
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                locale="es"
                dayClassName={dayClassName}
            />
        </div>
    );
};

export default Calendario;
