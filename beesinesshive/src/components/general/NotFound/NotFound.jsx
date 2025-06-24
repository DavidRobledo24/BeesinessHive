import React from 'react'
import style from './notFound.module.css'
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate(); 
  return (
    <div className={style.container}>
        <h1 className={style.title}>Oops!</h1>
        <p className={style.errorCode}>404 - PÁGINA NO ENCONTRADA</p>
        <p className={style.message}>Es posible que la página que estás buscando haya sido eliminada, haya cambiado de nombre o no esté disponible temporalmente.</p>
        <button onClick={() => navigate(-1)} className={style.button} style={{ cursor:'pointer', fontSize:'20px' }}>
                volver
        </button>
    </div>
  )
}
