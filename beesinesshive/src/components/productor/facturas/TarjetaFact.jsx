import React, { useEffect, useState } from "react";
import style from './facturas.module.css'
import Swal from 'sweetalert2';
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TarjetaFact(props) {
  const { user, login, logout } = useAuth();
  const token = user?.token;
  const { idItemFactura} = props;
 
  const buttonText = props.estado === 'pendiente' ? 'Pendiente' : 'Completado';
  const buttonClass = props.estado === 'pendiente' ? style.btnPendiente : style.btnCompletado;
  
  const uploadFacturaEstado= async ()=>{
    try {
    const responseFacturaEstado= await fetch(`http://54.87.25.132/itemFacturas/${idItemFactura}`,{
           method:'PUT',
           headers:{
                       'Content-Type': 'application/json',
                          'authorization': `Bearer ${token}`
           },
                          body: JSON.stringify({estado:"completado"})
         })
           
          if(responseFacturaEstado.ok) {
             
                Swal.fire({
                  title: "estado modificado con éxito",
                  icon: "success",
                 
              })
              window.location.reload();
              
              } else {
                Swal.fire({
                  title: "Error al modificar el estado",
                  icon: "error"
                });
              } 
        
    }catch(error){
      console.error("Error al cambiar el estado de la factura:", error);
      Swal.fire({
        title: "Hubo un error",
        text: "No se pudo modificar el estado. Inténtalo nuevamente.",
        icon: "error"
      });
    }
  }

  return (
    <div className={style.contenedorProducto}>
            <div className={style.infoProducto}>
                <p>Número de la factura: {props.numero}</p>
                <p>Enviar a: {props.nombreComprador}</p>
                <p>Producto a enviar: {props.nombreArticulo}</p>
                <p>Cantidad: {props.cantidad}</p>
                <p>Direccion de envio: {props.direccion} </p>
                <p>Precio: {props.precio} COP</p>
            </div>  
            <div className={style.fechaContenedor}>
                <h3 className={style.fecha}>{props.fecha}</h3>
                <button className={`${style.btnPrincipal} ${buttonClass}`}  onClick={uploadFacturaEstado} disabled={props.estado === 'pendiente' ? false : true}>
                   {buttonText}
               </button>
            </div>
        </div>
  )
  
}
