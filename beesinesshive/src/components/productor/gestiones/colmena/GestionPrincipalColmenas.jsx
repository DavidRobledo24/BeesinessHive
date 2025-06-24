import React, { useEffect,useState } from 'react';
import CardActivityColmena from './CardColmena';
import styles from '../gestion.module.css'
import { useAuth } from '../../../general/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { id } from 'date-fns/locale/id';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../../general/navbar/Navbar";
import Footer from "../../../general/footer/Footer";

const GestionPrincipalColmena= () => {
    const { user, login, logout } = useAuth();
const token = user?.token; 
const location = useLocation(); // Obtén el estado desde la ubicación actual
const { idApiario,nombre } = location.state || {}; // Extrae el idApiario del estado
const [actividades, setActividades] = useState([]);
const navigate = useNavigate();


// hacer fetch con numero de apiario para servir el contenido de la bitacora de apiarios aca
useEffect(() => {
    actividadesColmena();

}, []);


const actividadesColmena = async () => {
  try{
    const responseActColmena= await fetch(`http://54.87.25.132/actividadColmena/productor/0`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}` // Incluye el token aquí
        }
    })
    
     
    if (!responseActColmena.ok) {
        throw new Error(`HTTP error! status: ${responseActColmena.status}`);
    }
    const data = await responseActColmena.json();
    

   /* setActividades(data);
    */      /*      const actividadesFiltradas = data.filter(actividad => actividad.idColmena === idColmena);

            // Actualiza el estado con las actividades filtradas
            setActividades(actividadesFiltradas);
            */
    }catch(error){
        console.error("Error fetching hives:", error);
    }
}
 
    // Función para manejar la redirección al hacer clic en un apiario
    const handleBitacoraClick = () => {
        //navigate(`/Gestionprincipal`); // Redirige a GestionarColmenas con el id del apiario
        navigate('/BitacoraApiario', { state: { idApiario, nombre } });
        
    };
    
    const handleColmenaClick = () => {
        //navigate(`/Gestionprincipal`); // Redirige a GestionarColmenas con el id del apiario
        navigate('/GestionarColmenas', { state: { idApiario, nombre } });
        
    };
    const handleVerActividad = (actividad) => {
        navigate('/Actividad', { 
            state: {
                actividad: actividad.actividad,
                fecha: new Date(actividad.fecha).toLocaleDateString(),
                descripcion: actividad.descripcion,
                idActividadApiario:actividad.idActividad
            }
        });
    };
    
    
    return (
        <div><Navbar/>
        <div className={styles.principal}>
            <h2 className={styles.title}>Gestión de la Colmena: {nombre} </h2>
            <div className={styles.contentBtns}>
                <button className={styles.btn + ' ' + styles.btnBitacora} onClick={handleBitacoraClick} >Bitacora</button>
                <button className={styles.btn + ' ' + styles.btnColmenas} onClick={handleColmenaClick}>Editar Colmena</button>
            </div>
            <div className={styles.container}>
                {/* Itera sobre las actividades y pasa cada una como props a CardActivity */}
                {actividades.length > 0 ? (
                    actividades.map((actividad) => (
                        <CardActivityColmena
                            key={actividad.idActividadApiario} // Usamos el id único como key
                            actividad={actividad.actividad}
                            fecha={new Date(actividad.fecha).toLocaleDateString()} // Convertir la fecha a formato legible
                            onClick={() => handleVerActividad(actividad)} 
                            descripcion={actividad.descripcion}
                            idActividadApiario={actividad.idActividadApiario}
                        />
                    ))
                ) : (
                    <p>No hay actividades registradas.</p>
                )}
            </div>
            {/*
            <div className={styles.container}>
                <div>
                     <CardActivity
                    actividad="El apiario tuvo limpieza"
                    fecha="25/06"
                    /> 
                </div>
            </div>
            */}
        </div>
        <Footer/>
        </div>
    );
}

export default GestionPrincipalColmena;
