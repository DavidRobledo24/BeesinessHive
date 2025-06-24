import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardApiario from './CardApiario';
import styles from '../gestion.module.css';
import { useAuth } from '../../../general/context/AuthContext';
import Navbar from "../../../general/navbar/Navbar";
import Footer from "../../../general/footer/Footer";
const GestionApiarios = () => {
    const [apiarios, setApiarios] = useState([]);
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
          })
      
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          if(decodedToken.role === "comprador") navigate("/");
          
        fetchHives();
    }, []);
    const fetchHives = async () => {
        try {
            const response = await fetch(`http://54.87.25.132/apiarios/producer/0`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}` // Incluye el token aquí
                }
            });
           
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
          
            setApiarios(data);
            
        } catch (error) {
            console.error("Error fetching hives:", error);
        }
    };

   

    // Función para manejar la redirección al hacer clic en un apiario
    const handleApiarioClick = (idApiario,nombre) => {
        //navigate(`/Gestionprincipal`); // Redirige a GestionarColmenas con el id del apiario
        navigate('/Gestionprincipal', { state: { idApiario, nombre } });
        
    };
   
    // Función para redirigir a la página de creación de apiario
    const handleNuevoApiarioClick = () => {
        navigate('/CreacionApiario'); // Redirige a la página de creación de apiario
    };

    return (
        <div> <Navbar/>
        <div className={styles.principal}>
            <h2 className={styles.title}>Gestión de Apiarios</h2>
            <div className={styles.container}>
                {apiarios.map((apiario, index) => (
                    <CardApiario 
                        key={index} 
                        nombre={apiario.nombre} 
                        idApiario={apiario.idApiario} 
                        onClick={handleApiarioClick} 
                    />
                ))}
                <div onClick={handleNuevoApiarioClick}>
                    <div className={styles.card + " " + styles.newCard}>
                        <p className={styles.icon}>&#43;</p>
                        <p className={styles.letter}>Nuevo Apiario</p>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default GestionApiarios;
