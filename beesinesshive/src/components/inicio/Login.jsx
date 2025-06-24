import React, { useState, useRef } from 'react';
import Swal from "sweetalert2";
import Navbar from '../general/navbar/Navbar';
import Footer from '../general/footer/Footer';
import style from './inicio.module.css';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const { login } = useAuth();
    const [errorEmail, setErrorEmail] = useState(false);
    const [vacioEmail, setVacioEmail] = useState(false);
    const [vacioPassword, setVacioPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [credInvalidas, setCredInvalidas] = useState(false);
    const navigate = useNavigate();
    const form = useRef();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const [values, setValues] = useState({
        correo: "",
        contrasena: "",
    })

    const handleClickEmail = () => {
        setErrorEmail(false);
        setVacioEmail(false);
        setCredInvalidas(false);
    }
    
    const handleClickPassword = () => {
        setVacioPassword(false);
        setCredInvalidas(false);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValues = {
            ...values,
            [name]: value,
        }
        setValues(newValues)
    }

    const iniciarSesion = async (e) => {
        e.preventDefault();

        let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

        let hasErrors = false;

        if(!values.correo){
            setVacioEmail(true);
            hasErrors = true;
        }
        else if(!validEmail.test(values.correo)){
            setErrorEmail(true);
            hasErrors = true;
        }
        else{
            setErrorEmail(false);
            setVacioEmail(false);
        }

        if(!values.contrasena){
            setVacioPassword(true);
            hasErrors = true;
        }
        else{
            setVacioPassword(false);
        }

        // if (values.contrasena.length === 0 && values.correo.length === 0) {
        //     setErrorEmail(true)
        //     setErrorPassword(true)
        //     return
        // }
        // if (values.contrasena.length === 0) {
        //     setErrorPassword(true)
        //     return
        // }
        // if (values.correo.length === 0) {
        //     setErrorEmail(true)
        //     return
        // }

        if(!hasErrors){
            try {
                const loginSesion = await fetch("http://54.87.25.132/logins", {
                    method: "POST",
                    headers: {
                        //'access-control-allow-origin': '*',
                        'content-type': 'application/json'
    
                    },
                    body: JSON.stringify(values),
                })
                const data = await loginSesion.json();
    
                if(data.error){
                    setCredInvalidas(true);
                }
                else if (data.token) { // Suponiendo que la respuesta incluye un token
                    //  login(data.token); // Guarda el token en el contexto
                    login({ token: data.token, idProductor: data.idProductor });
                    form.current.reset();
                    setValues({ correo: '', contrasena: '' });
                    navigate(data.redirectUrl);
                }
    
    
            } catch (error) {
                Swal.fire('Error', 'No fue posible el proceso de login', 'error');
            };
        }
    }

    return (
        <>
        <Navbar/>
        <div className={style.login}>
            <h2>Bienvenid@ a Beesiness<span>Hive</span>, <br /> Inicia sesión </h2>
            <form action="" onSubmit={iniciarSesion} className="php-email-form" ref={form} data-aos="fade-up" data-aos-delay="200">

                <div className={style.box}>
                    <EmailIcon sx={{ fontSize: 20 }} className={style.icon} />
                    <input type="email" placeholder='Correo' name="correo" id="correo" autoComplete="email" onChange={handleChange} onClick={handleClickEmail} />
                </div>
                    {vacioEmail ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15  }}>Ingrese un correo electronico</p> : ""}
                    {errorEmail ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15  }}>Ingrese un correo electronico valido</p> : ""}
                <div className={style.box}>
                    <LockIcon sx={{ fontSize: 20 }} className={style.icon} />
                    <input type={showPassword ? 'text' : 'password'} placeholder='Contraseña' name="contrasena" autoComplete="current-password" id="contrasena" onChange={handleChange} onClick={handleClickPassword} />
                    <span className="input-group-text" onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </span>
                </div>
                    {vacioPassword ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15  }}>Ingrese una contraseña</p> : ""}
                    {credInvalidas ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15  }}>Credenciales inválidas</p> : ""}
                {/* <div className={style.checkBox}>
                    Falta darle funcionalidad
                    <input type="checkbox" />
                    <label>Recordarme</label>
                </div> */}
                <button type='submit' className={style.btnPrincipal}>Iniciar Sesión</button>
            </form>
            <div className={style.forget}>
                <p>¿Olvidaste tu contraseña?</p>
                <Link to='/cambiarContraseña'>Click aquí</Link>
            </div>
            <div className={style.signUp}>
                <p>¿No tienes Cuenta? <Link to='/rol'>Registrate</Link></p>
            </div>
        </div>
        <Footer/>
        </>
    );
}

export default Login;