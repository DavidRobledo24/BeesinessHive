import React, { useEffect } from 'react'
import Navbar from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Tarjeta from './Tarjeta'
import Abeja from '../../../assets/abejaLogo.png'
import estilo from '../../productor/Notificaciones/NotificacionesApicultor.module.css'
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function NotificacionesMarketplace() {
  const { user, login, logout } = useAuth();
  const token = user?.token;
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
    })
  }, []);

  return (
    <div>
      <Navbar/>
      <div style={{margin:'5% 8%' }}>
        <h2 className={estilo.TituloBitacora}>
          Notificaciones Recientes:
        </h2>
        
      <Tarjeta
        imagen={{Abeja}}
        descripcion="El Marketplace esta activo para todos los usuarios compradores y para la venta de los apicultores."
        fecha="2/12"
      />
      <Tarjeta
        imagen={{Abeja}}
        descripcion="Bienvenido a la Familia BeesinessHive, explora y disfruta nuestros servicios."
        fecha="2/12"
      />
      </div>
      <Footer/>
    </div>
  )
}
