import React from 'react';
import HiveSharpIcon from '@mui/icons-material/HiveSharp';
import styles from '../gestion.module.css';

const CardApiario = ({ nombre, idApiario, onClick }) => {
    return (
        <div onClick={() => onClick(idApiario,nombre)}>
            <div className={styles.card}>
                <HiveSharpIcon color='inherit' fontSize='large' />
                <p className={styles.letter}>{nombre}</p>
            </div>
        </div>
    );
};

export default CardApiario;

