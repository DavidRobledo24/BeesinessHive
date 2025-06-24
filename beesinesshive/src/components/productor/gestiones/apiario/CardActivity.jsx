import React from 'react';
import { Link } from "react-router-dom"; 
import HiveSharpIcon from '@mui/icons-material/HiveSharp';
import styles from '../gestion.module.css'

const CardActivity = ({ actividad, fecha, onClick }) => {
    const handleClick = (e) => {
        e.preventDefault(); // Prevenir la navegación automática del Link
        if (onClick) {
            onClick(); // Ejecuta la función onClick pasada como prop
        }
    };
    return (
        <div>
            <Link to='' className={styles.card + ' ' + styles.remmenberCards} onClick={handleClick} >
                <div>
                    <HiveSharpIcon color='inheret' fontSize='large' />
                </div>
                <div className={styles.text}>
                    <div>
                        <p>{actividad}</p>
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


