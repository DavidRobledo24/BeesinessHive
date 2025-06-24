import React, { useEffect, useState } from 'react';
import TarjetaChat from "./TarjetaChatByComprador";
import estilo from "./notificacionesChat.module.css";
import Footer from '../../../general/footer/Footer';
import Navbar from'../../../general/navbar/Navbar' 
import { useAuth } from '../../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';

function NotificacionesChatComprador() {
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
    if(decodedToken.role === "productor") navigate("/");

    fetchLoadChat()
   },[]);
// cambiar esto para que consulte en comprador
const fetchLoadChat = async ()=>{
 try{
    const response= await fetch('http://54.87.25.132/chat/byComprador',{
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
   
      if (vendedorId) {
        // Obtener el nombre del comprador
        const nombreVendedorResponse = await fetch(`http://54.87.25.132/producers/chat/${vendedorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
          }
        });

        if (nombreVendedorResponse.ok) {
          const vendedorData = await nombreVendedorResponse.json();
          // Guardar el nombre del comprador en el mapa usando IdConversacion como clave
          vendedoresMap[chat.IdConversacion] = vendedorData.User.nombreCompleto;
        } else {
          console.error("No se pudo obtener el nombre del vendedor.");
        }
      }
     if (compradorId) {
        compradoresMap[chat.IdConversacion] = compradorId;
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
        const vendedoresNombre = vendedores[chat.IdConversacion]; // Obtener el nombre del comprador de la conversación actual
        const compradorId = compradores[chat.IdConversacion]; // Obtener el vendedorId desde el mapa de vendedores


        return (
          <TarjetaChat
            key={index}
            comprador={vendedoresNombre || 'Cargando...'} // Nombre del rol
            descripcion={lastMessage.content} // Contenido del último mensaje
            fecha={lastMessage.timestamp} // Fecha del último mensaje
            IdConversacion={chat.IdConversacion}
            comp={vendedoresNombre}
            compradorId={compradorId}
          />
        );
      })}
     </div>
      <Footer/>
      
    </>
  );
}

export default NotificacionesChatComprador;
