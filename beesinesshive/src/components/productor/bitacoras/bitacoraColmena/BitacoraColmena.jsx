import React, { useState, useEffect } from 'react';
import style from '../../../inicio/inicio.module.css';
import '../bitacoras.css';
import Calendario from '../calendario/Calendario.jsx';
import Navbar from '../../../general/navbar/Navbar.jsx';
import Footer from '../../../general/footer/Footer.jsx';
import { Link } from "react-router-dom"; 
import { useAuth } from '../../../general/context/AuthContext.jsx';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Azure from '../../clienteAzure/Azure.jsx';
const BitacoraColmena = () => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [tipoActividad, setActividad] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Estados para mensajes de error específicos de cada campo
    const [errorActividad, setErrorActividad] = useState("");
    const [errorDescripcion, setErrorDescripcion] = useState("");
    const [errorFecha, setErrorFecha] = useState("");
    const location = useLocation();
    const { idColmena, idApiario, nombreColmena} = location.state || {}; // Extrae el idApiario del estado
     const navigate = useNavigate();
    const { user, login, logout } = useAuth();
    const token = user?.token; 

    useEffect(() => {
        if(!token){
            navigate("/")
            return;
        }
    
        fetch(`http://54.87.25.132/articulos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
        }).then(response => {
            if(response.status == 403){
                logout();
                navigate("/");
                return
            }
            else if(response.status == 200){
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                if(decodedToken.role === "comprador") navigate("/");
                else if(decodedToken.role === "productor" && (!idApiario || !idColmena)) navigate("/gestionApiarios");
            }
        })
    }, []);

    // Función para manejar la selección de un día
  

    const handleDaySelect = (day) => {
        setSelectedDay(day);
        setErrorFecha(""); // Limpiar error al seleccionar un día
    };


    const handleTranscriptChange = (newTranscript) => {
        setDescripcion(newTranscript); // Aquí sincronizamos directamente la transcripción con la descripción
        
    };



    const handleGuardar = async () => {
        let isValid = true;

        if (!selectedDay) {
            setErrorFecha("Por favor, selecciona una fecha.");
            isValid = false;
        } else {
            setErrorFecha("");
        }

        if (!tipoActividad) {
            setErrorActividad("Por favor, selecciona una actividad.");
            isValid = false;
        } else {
            setErrorActividad("");
        }

        if (!descripcion) {
            setErrorDescripcion("Por favor, ingresa una descripción.");
            isValid = false;
        } else {
            setErrorDescripcion("");
        }

        if (!isValid) return;

        const nuevaActividad = {
            tipoActividad,
            descripcion,
            fecha: selectedDay,
            idColmena,
        };
       
        try {
            const response = await fetch('http://54.87.25.132/actividadColmena', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(nuevaActividad)
            });

            if (response.ok) {
                setActividad("");
                setDescripcion("");
                setSelectedDay(null);

                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Se agregó la tarea correctamente.',
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
                navigate('/ActividadesColmena',{ 
                    state: { idApiario, idColmena, nombreColmena}
                } ) ;    
            } else {
                Swal.fire('Error','No se puedo agregar la tarea','error');
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            Swal.fire('Error','Error en la solicitud','warning');
        }
    };

    return (
        <div>
            <Navbar />
            <div className='pageBitacora'>
                <h2 className='titulo'>Bitacora Colmena:{nombreColmena}</h2>
                <p>Deseas Registrar algo nuevo hoy?</p>
                <div className="bitacora">
                    <div className="calendario">
                        <p>Selecciona el día:</p>
                        <Calendario onDaySelect={handleDaySelect} />
                        {errorFecha && <p className="errorMensaje">{errorFecha}</p>}
                    </div>
                    <form className='actividades'>
                        <div className="registroActividad">
                            <label htmlFor="activity">Actividad que se hizo:</label>
                            <div className={style.box}>
                            <select name="actividad" id="activity" value={tipoActividad} onChange={(e) => setActividad(e.target.value)}>
                                    <option value="">Selecciona una actividad</option>
                                    <option value="inspección">Inspección</option>
                                    <option value="alimentación">Alimentación</option>
                                    <option value="revisión">Revisión</option>
                                </select>
                            </div>
                            {errorActividad && <p className="errorMensaje">{errorActividad}</p>}
                            <label htmlFor="description">Notas del Apicultor:</label>
                            <div className={style.box}>
                                <textarea
                                    name="descripcion"
                                    id="description"
                                    placeholder='Descripción'
                                    rows="7"
                                    cols="30"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                ></textarea>
                            </div>
                            <Azure onTranscriptChange={handleTranscriptChange}  />
                            {errorDescripcion && <p className="errorMensaje">{errorDescripcion}</p>}
                        </div>
                    </form>
                    <div className="btnsBitacora">
                        <Link to='/Gestionprincipal' type='button' className='btnBorrar' onClick={() => { setActividad(''); setDescripcion(''); setSelectedDay(null); }}>Borrar</Link>
                        <button
                            type='button'
                            className='btnGuardar'
                            onClick={handleGuardar}
                            
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default BitacoraColmena;
