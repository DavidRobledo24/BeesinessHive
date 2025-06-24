import React, { useEffect,useState } from 'react';
import TarjetaBitacora from "./TarjetaBitacora";
import estilo from "./NotificacionesApicultor.module.css";
import Navbar from "../../general/navbar/Navbar";
import EditIcon from '@mui/icons-material/Edit';
import Footer from '../../general/footer/Footer'
import { useAuth } from '../../general/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function NotificacionesApicultor() {
  const { user, login, logout } = useAuth();
const token = user?.token; 
const location = useLocation(); // Obtén el estado desde la ubicación actual
const { idColmena,nombreColmena,idApiario} = location.state || {}; // Extrae el idApiario del estado


const [actividades, setActividades] = useState([]);

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
        else if(decodedToken.role === "productor" && (!idApiario || !idColmena)) navigate("/gestionApiarios");
      }
  })

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

   const actividadesFiltradas = data.filter(actividad => actividad.idColmena === idColmena);

   setActividades(actividadesFiltradas);
  
    }catch(error){
        console.error("Error fetching hives:", error);
    }
}

const handleAddActividad = (idColmena) => {
  if (!idColmena) {
      console.error("idColmena es indefinido o nulo");
      return;
  }
  navigate('/BitacoraColmena', { 
      state: { idColmena, nombreColmena, idApiario}
  });
};


const handleLoadActividad = (actividad) => {
  const { fecha, descripcion, tipoActividad, idActividad } = actividad;
  navigate('/colmenaactividad', { 
    state: { 
      idColmena, 
      nombreColmena, 
      idApiario,  
      fecha, 
      descripcion, 
      actividad: tipoActividad,
      idActividad
    }
  });
};
const handleEditColmena = (idColmena) => {

  navigate('/EditarColmena', {state:{idColmena}});
};

  return (
    <>
      <Navbar />   
            <div className={estilo.container}>
            <h1 className={estilo.TituloBitacora}>
              Actividades Recientes de Colmena: {nombreColmena}
            </h1>
                {/* Itera sobre las actividades y pasa cada una como props a CardActivity */}
                {actividades.length > 0 ? (
                    actividades.map((actividad) => (
                        <TarjetaBitacora
                          
                            key={actividad.idActividad} // Usamos el id único como key
                            actividad={actividad.tipoActividad}
                            fecha={new Date(actividad.fecha).toLocaleDateString()} // Convertir la fecha a formato legible
                           // onClick={handleLoadActividad}
                           onClick={() => handleLoadActividad(actividad)} 
                            descripcion={actividad.descripcion}
                            idActividad={actividad.idActividad}
                        />
                    ))
                ) : (
                    <p>No hay actividades registradas.</p>
                )}
            </div>
     

      <div className={estilo.botonesNegros}>
    
      <button className={estilo.BotonAgregarCol} onClick={() => handleEditColmena(idColmena)}><EditIcon  sx={{ fontSize: 25 }}/></button>
      <button className={estilo.BotonAgregarCol} onClick={() => handleAddActividad(idColmena)}>+</button>
      </div>
      <Footer/>
    </>
  );
}

export default NotificacionesApicultor;
