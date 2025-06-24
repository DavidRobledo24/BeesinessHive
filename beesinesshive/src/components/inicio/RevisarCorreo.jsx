import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './inicio.module.css'; './inicio.css';
import Navbar from "../general/navbar/Navbar"
import Footer from "../general/footer/Footer"

const RevisarCorreo =()=> {
    const navigate = useNavigate();

    const handleVolverAlLogin = () => {
        navigate('/login');
    };
    return (
        <>
        <Navbar/>
        <div className={style.revisarCorreo}>
            <h2>¡Revisa tu correo!</h2>
            <p>Se ha enviado un correo a <span>{`${localStorage.getItem("correo")}`}</span> con instrucciones para reiniciar tu contraseña.</p>
            
            <form action="">
                <button type='button' className={style.btnPrincipal} onClick={handleVolverAlLogin}> Volver al login </button>
            </form>
        </div>
        <Footer/>
        </>
    );
}


export default RevisarCorreo;