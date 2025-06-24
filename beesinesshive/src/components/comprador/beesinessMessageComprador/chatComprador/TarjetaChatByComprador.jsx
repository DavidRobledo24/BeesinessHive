import React, { useEffect, useState } from 'react';
import notificacionesEstilo from './notificacionesChat.module.css';
import colmena from '../../../../assets/colmena.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../general/context/AuthContext.jsx';
import ForumIcon from '@mui/icons-material/Forum';
/*

-despues, ver opciones de seleccionar las notificaciones, los ultimos que no sean del man y ver como marcar como leidos los que no se han leido 
- cambiar al nombre del personaje que envió
- tercero que al darle click se abra el chat en especial y cargue la informacion 
-creo que tocara  modificar el lambda 
-crear el idchat en front o back?
*/

function TarjetaChat(props){
   
    const { user, login, logout } = useAuth();
    const token = user?.token; 
    
    const navigate = useNavigate();
    

    const handleCardClick = () => {
        // Aquí puedes cambiar 'ruta-destino' por la ruta a la que quieras redirigir
        navigate('/ChatByComprador', { state: {  IdConversacion: props.IdConversacion, comprador:props.comp, compradorId:props.compradorId} }); 
      };
    
    

    return(
        <div> 
                  
        <div className={notificacionesEstilo.contenedorProducto}onClick={handleCardClick}>
      
            <ForumIcon className={notificacionesEstilo.imagenProducto} sx={{fontSize: {xs: 55, sm: 70, md: 80, },}} />
 
            <div className={notificacionesEstilo.infoProducto}>
                <h2 className={notificacionesEstilo.nombre} > {props.comprador}</h2>
                <p className={ notificacionesEstilo.contenedorTexto}> {props.descripcion}</p>
                <p className={ notificacionesEstilo.contenedorTexto}> {props.IdConversacion}</p>
            </div>  
            <div className={notificacionesEstilo.espacioFecha}>
            <h3 className={ notificacionesEstilo.fechaContenedor}>{props.fecha}</h3>
            </div>
        </div>
    
        </div>
    )
}

export default TarjetaChat;
