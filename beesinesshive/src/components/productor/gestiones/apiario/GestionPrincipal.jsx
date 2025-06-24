import React, { useEffect,useState } from 'react';
import CardActivity from './CardActivity';
import styles from '../gestion.module.css'
import estilo from "../../Notificaciones/NotificacionesApicultor.module.css";
import { useAuth } from '../../../general/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { id } from 'date-fns/locale/id';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../../general/navbar/Navbar";
import Footer from "../../../general/footer/Footer";
import EditIcon from '@mui/icons-material/Edit';

const GestionPrincipal = () => {
    const { user, login, logout } = useAuth();
const token = user?.token; 
const location = useLocation(); // Obtén el estado desde la ubicación actual
const { idApiario,nombre } = location.state || {}; // Extrae el idApiario del estado
const [actividades, setActividades] = useState([]);

const navigate = useNavigate();


// hacer fetch con numero de apiario para servir el contenido de la bitacora de apiarios aca
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
            else if(decodedToken.role === "productor" && !idApiario) navigate("/gestionApiarios");
        }
    })

    actividadesApiario();
}, []);


const actividadesApiario = async () => {
  try{
    const responseActApiario= await fetch(`http://54.87.25.132/actividadApiario/productor/0`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}` // Incluye el token aquí
        }
    })
     
    if (!responseActApiario.ok) {
        throw new Error(`HTTP error! status: ${responseActApiario.status}`);
    }
    const data = await responseActApiario.json();
             const actividadesFiltradas = data.filter(actividad => actividad.idApiario === idApiario);

            // Actualiza el estado con las actividades filtradas
            setActividades(actividadesFiltradas);
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
                idActividadApiario:actividad.idActividadApiario
            }
        });
    };
    const handleEditApiario = (idApiario) => {
     
        navigate('/editarApiario',{state:{idApiario}});
      };
      
    
    return (
        <div><Navbar/>
        <div className={styles.principal}>
            <h2 className={styles.title}>Gestión del Apiario: {nombre} </h2>
            <div className={styles.contentBtns}>
                <button className={styles.btn + ' ' + styles.btnBitacora} onClick={handleBitacoraClick} >Bitacora</button>
                <button className={styles.btn + ' ' + styles.btnColmenas} onClick={handleColmenaClick}>Colmenas</button>
            </div>
            
            <div className={styles.container}>
                {/* Itera sobre las actividades y pasa cada una como props a CardActivity */}
                {actividades.length > 0 ? (
                    actividades.map((actividad) => (
                        <CardActivity
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
            <div className={estilo.botonesNegros}>
    
                <button className={estilo.BotonAgregarCol} onClick={() => handleEditApiario(idApiario)}><EditIcon  sx={{ fontSize: 25 }}/></button>

            </div>
        </div>
        <Footer/>
        </div>
    );
}

export default GestionPrincipal;
