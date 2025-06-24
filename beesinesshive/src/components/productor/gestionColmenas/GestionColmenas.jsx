import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import style from "./gColmenas.module.css";
import Navbar from "../../general/navbar/Navbar";
import Footer from "../../general/footer/Footer";
import plus from "../../../assets/signo_suma.png";
import colmenaImage from "../../../assets/colmena.png";
import { useAuth } from '../../general/context/AuthContext';
import { useLocation } from 'react-router-dom';

//import colmenaImage from "../../../assets/colmena.png";

export default function GestionColmenas() {
    const [hives, setHives] = useState([]);

    const { user, login, logout } = useAuth();
    const token = user?.token; 
    const location = useLocation(); // Obtén el estado desde la ubicación actual
    const { idApiario,nombre, nombreColmena } = location.state || {}; 
    const [colmenas, setColmenas] = useState([]);
    const navigate = useNavigate();
    console.log(">>>>>>idapiario al abrir  notificaciones colmena", idApiario)
    // Función para traer las colmenas desde el backend en la ruta correcta
    const fetchHives = async () => {
        try {
            const responseColmenaByApiario = await fetch('http://54.87.25.132/colmenas/productor/4', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}` // Incluye el token aquí
                }
            });
            if (!responseColmenaByApiario.ok) {
                throw new Error(`HTTP error! status: ${responseColmenaByApiario.status}`);
            }
             // url del endpoint de la api
            const data = await responseColmenaByApiario.json();
            const actividadesFiltradas = data.filter(colmena => colmena.idApiario === idApiario);

            // Actualizamos el estado con las colmenas filtradas
            setColmenas(actividadesFiltradas);
            
    
        } catch (error) {
            
            console.error("Error fetching hives:", error);
        }
    };

    // Se llama la funcion para  mostrar el contenido
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
        
        fetchHives();
    }, []);


    function handleAddHive(idApiario) {
        console.log("Agregar nueva colmena");
        navigate('/CrearColmena', { state: { idApiario, nombre } });
    }
    
    // Función para manejar la redirección al hacer clic en un apiario
    const handleActividadesColmena = (idColmena, nombreColmena) => {
       
        navigate('/ActividadesColmena',{ state: { idColmena,  nombreColmena, idApiario } });
        
    };
    return (
        <>
            {/* Pendiente: AutoGeneración de Colmenas al agregar una nueva */}
            {/* Pendiente: Evento que al clicar en la imagen de colmena X, vaya a la vista/bitacora de esa colmena*/}
            {/* Pendiente: Evento que al clicar en la imagen de + para crear una nueva colmmena*/}
            {/* Pendiente: Redirección del + al "crear colmena" */}

            <Navbar />
            <div className={style.containerAll}>
                <div className={style.containerTitle}>
                    <h1 className={style.titulo}>Gestión de Colmenas: {nombreColmena}</h1>
                </div>

                <div className={style.container}>
                    {/* Aquí se renderizan de manera dinámica las colmenas */}
                    {colmenas.map((colmena) => (
                        // El método handleHiveClick da función al click sobre las colmenas
                        <div key={colmena.idColmena} className={style.containerHive}onClick={() => handleActividadesColmena(colmena.idColmena,colmena.nombre)}>
                            {/* Aquí se añade la imagen de la colmena predeterminada */}
                            <img className={style.image} src={colmenaImage} alt="Imagen de colmena" />
                            <h3 className={style.texto}>{colmena.nombre}</h3>
                           
                        </div>
                    ))}
                    
                    {/* Botón para agregar una nueva colmena */}
                    <div className={style.containerHive} onClick={() => handleAddHive(idApiario)}>
                        <img className={style.image} src={plus} alt="Agregar nueva colmena" />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );

   
}

