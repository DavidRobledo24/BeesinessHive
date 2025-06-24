import React, { useEffect,useState } from 'react';
import Navbar from '../../general/navbar/Navbar';  // Asegúrate de que la ruta sea correcta
import Footer from '../../general/footer/Footer'; // Asegúrate de que la ruta sea correcta
import style from '../../inicio/inicio.module.css';
import Style from './actividad.module.css';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2'
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ActividadColmena = () => {
  const { user, login, logout } = useAuth();
    const token = user?.token; 
  const location = useLocation(); // Obtén el estado desde la ubicación actual
  const { idColmena, nombreColmena, idApiario, fecha, descripcion, actividad, idActividad} = location.state || {}; 
 
  const navigate = useNavigate();

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
          else if(decodedToken.role === "productor" && (!idColmena || !idActividad)) navigate("/gestionApiarios");
        }
    })
  }, []);
       
  const handleColmenaClick =async () => {
    
 
    await fetch(`http://54.87.25.132/actividadColmena/${idActividad}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'authorization': `Bearer ${token}`
      },
      
    })
  
      .then((response) => {
        if (response.status === 204) {

        Swal.fire({
          title: '¡Éxito!',
          text: 'Actividad de la colmenta eliminada correctamente.',
          icon: 'success',// esto da el color que esta alrededor de icono
          iconHtml: '🗑️',
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
        
       // window.location.reload(); // ojo!!! este window puede joder temas de inicios de sesion, si sale algo mal, que solo se use navigate a principalCards
          navigate('/ActividadesColmena',{state:{idColmena,nombreColmena}});
        } else {
          alert(`Error: ${response.status}`);
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "No fue posible eliminar la actividad colmena por un error interno del servidor ",
          icon: "error"
      })
      });
      
  };

  return (
    <div>
     <Navbar/>
      <div className={Style.container}>
      <a href="#" className={style.regreso} onClick={() => navigate(-1)}>Volver</a>
        <div className={Style.caja}>
          <div className={Style.contentInfo}>
            <h3>Fecha:</h3>
            <p>{fecha}</p>
            <h3>Actividad:</h3>
            <p>{actividad}</p>
            <h3>Descripción:</h3>
            <p>{descripcion}</p>
          </div>
          <button type="button"onClick={handleColmenaClick} className="btnBorrar">Borrar</button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default ActividadColmena;