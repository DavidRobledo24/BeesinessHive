/*import React from 'react';
import { Link } from "react-router-dom"; 
import notificacionesEstilo from './NotificacionesApicultor.module.css';
//import styles from '../gestiones/gestion.module.css'

import colmena from '../../../assets/colmena.png';
function TarjetaBitacora(props){
/*
    const CardActivity = ({ actividad, fecha, onClick }) => {
        const handleClick = (e) => {
            e.preventDefault(); // Prevenir la navegación automática del Link
            if (onClick) {
                onClick(); // Ejecuta la función onClick pasada como prop
            }
        };
    return(
        <div className={notificacionesEstilo.contenedorProducto}>
            <img className={notificacionesEstilo.imagen} src={colmena} alt=""  />

            <div className={notificacionesEstilo.infoProducto}>
                <p className={ notificacionesEstilo.contenedorTexto}>{props.descripcion}</p>
            </div>  
            <h3 className={ notificacionesEstilo.fechaContenedor}>{props.fecha}</h3>
        </div>
    )
}

export default TarjetaBitacora;
*/
import React from 'react';
import { Link } from "react-router-dom"; 
import HiveSharpIcon from '@mui/icons-material/HiveSharp';
import styles from '../gestiones/gestion.module.css'
import notificacionesEstilo from './NotificacionesApicultor.module.css';

const CardActivity = ({ actividad, fecha,  descripcion, onClick }) => {
    const handleClick = (e) => {
        e.preventDefault(); // Prevenir la navegación automática del Link
        if (onClick) {
            onClick(); // Ejecuta la función onClick pasada como prop
        }
    };

    return (
        <div  className={notificacionesEstilo.contenedorProducto}>
            <Link to='' className={styles.card + ' ' + styles.remmenberCards} onClick={handleClick} >
                <div>
                    <HiveSharpIcon color='inheret' fontSize='large' />
                </div>
                <div className={styles.text}>
                    <div>
                        <p>{actividad}:</p>
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