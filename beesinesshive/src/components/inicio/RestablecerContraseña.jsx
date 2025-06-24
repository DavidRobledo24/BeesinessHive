import React, { useState, useRef } from 'react';
import style from './inicio.module.css';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import Navbar from "../general/navbar/Navbar"
import Footer from "../general/footer/Footer"

const RestablecerContraseña = () => {
    const { id } = useParams();

    const form = useRef();
    const navigate = useNavigate();
    const [vacioContra, setVacioContra] = useState(false);
    const [errorRepetir, setErrorRepetir] = useState(false);

    const [contras, setContras] = useState({
        pass1: "",
        password: ""
    });

    const [values, setValues] = useState({
        password: "",
        idUser: id
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "pass1") {
            const newContras = {
                ...contras,
                [name]: value
            }
            setContras(newContras);
        }
        else {
            const newValues = {
                ...values,
                [name]: value,
            }
            setValues(newValues)
            const newContras = {
                ...contras,
                [name]: value
            }
            setContras(newContras);
        }
    }

    const handleClick = (e) => {
        setVacioContra(false);
        setErrorRepetir(false);
    }

    async function changePsw(e) {
        e.preventDefault();

        let hasErrors = false;

        if (!contras.pass1) {
            setVacioContra(true);
            hasErrors = true;
        }
        else if (contras.pass1 !== contras.password) {
            setErrorRepetir(true);
            hasErrors = true;
        }
        else {
            setVacioContra(false);
            setErrorRepetir(false);
        }

        if (hasErrors) return;


        // remover la información del correo en el localstorage
        localStorage.removeItem("correo");


        try {
            const changePsw = await fetch("http://54.87.25.132/cambiarContrasena/restablecer", {
                method: "PATCH",
                headers: {
                    'access-control-allow-origin': '*',
                    'content-type': 'application/json',
                },
                body: JSON.stringify(values)
            })

            if (changePsw.status === 201) {
                const data = await changePsw.json();
                Swal.fire({
                    title: '¡Éxito!',
                    text: '', //esta alerta le falta un mensaje, no se que poner
                    icon: 'success',// esto da el color que esta alrededor de icono
                    iconHtml: '🐝',
                    background: 'linear-gradient(to right, #FFA500,  #FF7F50  )',
                    color: '#fff', 
                    confirmButtonText: 'Entendido',
                    buttonsStyling: false,
                    customClass: {
                      popup: '',
                      confirmButton: '', 
                    },// se le dan los estilos al boton a mano
                    didRender: (popup) => {
                      const confirmButton = popup.querySelector('.swal2-confirm');
                      confirmButton.style.backgroundColor = '#000';
                      confirmButton.style.color = '#fff';
                      confirmButton.style.border = 'none';
                      confirmButton.style.borderRadius = '10px'; 
                      confirmButton.style.padding = '10px 20px'; 
                      confirmButton.style.fontSize = '16px'; 
                      confirmButton.style.cursor = 'pointer';
                      confirmButton.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)'; 
                    },
                  });
                  
                form.current.reset();
                setValues({ password: "" })
                navigate(data.redirectUrl);
            }


        } catch (error) {
            Swal.fire('Error', `No fue posible conectar con el servidor ${error} `);
        };

    }


    return (
        <>
            <Navbar />
            <div className={style.restablecerContraseña}>
                <h2>Restablecer Contraseña</h2>
                <p>Ingresa una nueva contraseña para que vuelvas a disfrutar de BeesinessHive</p>
                <form action="" ref={form} onSubmit={changePsw} >
                    <div className={style.box}>
                        <LockIcon sx={{ fontSize: 20 }} className={style.icon} />
                        <input type="password" onChange={handleChange} onClick={handleClick} name='pass1' placeholder='Contraseña' />
                    </div>
                    {vacioContra ? <p style={{ color: "red", fontSize: 15, textAlign: "justify", marginLeft: 15 }}>Ingrese una contraseña</p> : ""}
                    <div className={style.box}>
                        <LockIcon sx={{ fontSize: 20 }} className={style.icon} />
                        <input type="password" onChange={handleChange} onClick={handleClick} name='password' placeholder='Repetir Contraseña' />
                    </div>
                    {errorRepetir ? <p style={{ color: "red", fontSize: 15, textAlign: "justify", marginLeft: 15 }}>Las contraseñas no coinciden</p> : ""}
                    <button type='submit' className={style.btnPrincipal}>Confirmar contraseña</button>
                </form>
            </div>
            <Footer />
        </>
    );
}

export default RestablecerContraseña;