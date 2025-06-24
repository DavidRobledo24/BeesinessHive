
import React from 'react';
import { Link } from "react-router-dom"; 
import HiveSharpIcon from '@mui/icons-material/HiveSharp';
import styles from '../../productor/gestiones/gestion.module.css'
import estilo from '../../productor/Notificaciones/NotificacionesApicultor.module.css';

const CardActivity = ({ actividad, fecha,  descripcion, onClick }) => {
    const handleClick = (e) => {
        e.preventDefault(); // Prevenir la navegación automática del Link
        if (onClick) {
            onClick(); // Ejecuta la función onClick pasada como prop
        }
    };

    return (
        <div  className={estilo.contenedorProducto}>
            <Link to='' className={styles.card + ' ' + styles.remmenberCards} onClick={handleClick} >
                <div>
                    <HiveSharpIcon color='inheret' fontSize='large' />
                </div>
                <div className={styles.text}>
                    <div>
                        <p>{descripcion}</p>
                    </div>
                    <div className={styles.date}>
                        <p>{fecha}</p>
                    </div>
                </div>

            </Link>
        </div>
    );
}

export default CardActivity; 