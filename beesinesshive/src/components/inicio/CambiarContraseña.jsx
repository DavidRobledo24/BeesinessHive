import React,  { useState, useRef} from 'react';
import style from './inicio.module.css';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';

import Navbar from "../general/navbar/Navbar"
import Footer from "../general/footer/Footer"
import { useAuth } from '../general/context/AuthContext';

const CambiarContraseña = () => {

    const { login } = useAuth();
    const form = useRef();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        correo: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValues = {
            ...values,
            [name]: value,
        }
        setValues(newValues)
    }

    async function postChangePsw(e) {

        e.preventDefault();

        try {
            const changePsw =  await fetch("http://54.87.25.132/cambiarContrasena", {
                method: "POST",
                headers: {
                    'access-control-allow-origin': '*',
                    'content-type': 'application/json'
                },
                body: JSON.stringify(values),
            })

            if (changePsw.ok) {
                const data = await changePsw.json();
                
                localStorage.setItem('correo',data.correo);
                form.current.reset();
                setValues({correo: ""})
                navigate(data.redirectUrl);
            }

        } catch (error) {
            alert("No fue posible el proceso de login por un error " + error);
        };
    }

    
    
    return (
        <>
        <Navbar/>
        
        <div className={style.cambiarContraseña}>
        <a href="#" className={style.regreso}>Volver</a>
        <h2>Restablece tu contraseña</h2>
        <p>Ingresa tu correo y te enviaremos instrucciones para reiniciar tu
            contraseña</p>
        <form action="" onSubmit={postChangePsw} ref={form} >
            <div className={style.box}>
                <EmailIcon sx={{ fontSize: 20 }} className={style.icon} />
                <input name='correo' type="email" placeholder='example@joinnus.com' onChange={handleChange} />
            </div>
            <button type='submit' className={style.btnPrincipal}>Restablecer contraseña</button>
        </form>
    </div>
        <Footer/>
        </>
);

}

export default CambiarContraseña;