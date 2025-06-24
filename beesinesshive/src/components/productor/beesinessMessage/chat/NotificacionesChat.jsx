import React, { useEffect, useState } from 'react';
import TarjetaChat from "./TarjetaChat";
import estilo from "./notificacionesChat.module.css";
import Footer from '../../../general/footer/Footer';

import EditIcon from '@mui/icons-material/Edit';
import Navbar from'../../../general/navbar/Navbar' 
import { useAuth } from '../../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NotificacionesChat() {
  const { user, login, logout } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();
  const [chats, setChats]=useState([]);
 
  const [compradores, setCompradores] = useState({}); // Estado para almacenar los compradores por IdConversacion
  const [vendedores, setVendedores] = useState({});

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
    
    fetchLoadChat()
   },[]);

const fetchLoadChat = async ()=>{
 try{
    const response= await fetch('http://54.87.25.132/chat/byProductor',{
        method:'GET',
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}` // Incluye el token aquí
        }
    })

    const data = await response.json();
    
     // Ordenar las conversaciones por el timestamp del último mensaje (más reciente primero)
     const sortedChats = data.sort((a, b) => {
      const lastMessageA = a.mensajes[a.mensajes.length - 1];
      const lastMessageB = b.mensajes[b.mensajes.length - 1];
      return new Date(lastMessageB.timestamp) - new Date(lastMessageA.timestamp);
    });
  
   if (response.ok) {
    // Aquí establecemos las conversaciones
    setChats(sortedChats);
    let compradoresMap = {};
   let vendedoresMap={};
    // Iterar sobre las conversaciones para obtener el nombre del comprador
    for (let chat of sortedChats) {
      // Encontrar el ID del comprador
      const compradorId = chat.mensajes.find(msg => msg.rol === "vendedor")?.id;
      const vendedorId = chat.mensajes.find(msg => msg.rol === "comprador")?.id;
     
      if (compradorId) {
        // Obtener el nombre del comprador
        const nombreCompradorResponse = await fetch(`http://54.87.25.132/compradores/porsi/${compradorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
          }
        });

        if (nombreCompradorResponse.ok) {
          const compradorData = await nombreCompradorResponse.json();
          // Guardar el nombre del comprador en el mapa usando IdConversacion como clave
          compradoresMap[chat.IdConversacion] = compradorData.User.nombreCompleto;
        } else {
          console.error("No se pudo obtener el nombre del comprador.");
        }
      }
     if (vendedorId) {
        vendedoresMap[chat.IdConversacion] = vendedorId;
      }
    }
    setCompradores(compradoresMap);
   setVendedores(vendedoresMap);
  }
    
 }catch(error){
    console.error("Error en la solicitud:", error);
 }

}



  return (
    <>
      <Navbar/>
      <div className={estilo.container}>
          <h1 className={estilo.TituloBitacora}>
      Beesiness<span>Message:</span>
    </h1>
    {/* Generacion de tarjetas pediente */}

    {/* Tarjetas placeholder, descomentar para probar */}

      {/* Generación de tarjetas con el último mensaje de cada conversación */}
      {chats.map((chat, index) => {
      const lastMessage = chat.mensajes[chat.mensajes.length - 1]; // Obtener el último mensaje
      const compradorNombre = compradores[chat.IdConversacion]; // Obtener el nombre del comprador de la conversación actual
      const vendedorId = vendedores[chat.IdConversacion]; // Obtener el vendedorId desde el mapa de vendedores


      return (
        <TarjetaChat
          key={index}
          comprador={compradorNombre || 'Cargando...'} // Nombre del rol
          descripcion={lastMessage.content} // Contenido del último mensaje
          fecha={lastMessage.timestamp} // Fecha del último mensaje
          IdConversacion={chat.IdConversacion}
          comp={compradorNombre}
          vendedorId={vendedorId}
        />
      );
    })}
      </div>
     <Footer/>
      
    </>
  );
}

export default NotificacionesChat;
