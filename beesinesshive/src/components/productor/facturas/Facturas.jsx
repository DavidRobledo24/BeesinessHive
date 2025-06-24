import React, { useEffect, useState } from "react";
import Navbar from '../../general/navbar/Navbar'
import Footer from '../../general/footer/Footer'
import Tarjeta from './TarjetaFact'
import estilo from './facturas.module.css'
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
//import { useLocation } from 'react-router-dom';
export default function Facturas() {
  const { user, login, logout } = useAuth();
  const token = user?.token;
  const[facturas,setFacturas]=useState([]);
  const [compradores, setCompradores] = useState({}); // Almacenamos los nombres de los compradores
  const [articulos, setArticulos] = useState({}); // Almacenamos los nombres de los compradores
  const navigate = useNavigate();
  const [facturasPendientes, setFacturasPendientes] = useState([]);
  const [facturasCompletadas, setFacturasCompletadas] = useState([]);
  const [mostrarPendientes, setMostrarPendientes] = useState(true);
  
 const loadFactura= async ()=>{
  const responseFactura= await fetch('http://54.87.25.132/itemFacturas/productor/0',{
         method:'GET',
         headers:{
                     'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
         }
       })
       if (!responseFactura.ok) {
         throw new Error(`HTTP error! status: ${ responseFactura.status}`);
     }
      // url del endpoint de la api
     const data = await  responseFactura.json();
     setFacturas(data);

     const facturasPendientes = data.filter(factura => factura.estado === 'pendiente');
     const facturasCompletadas = data.filter(factura => factura.estado === 'completado');
 
     // Actualizar los estados con las facturas correspondientes
     setFacturasPendientes(facturasPendientes);
     setFacturasCompletadas(facturasCompletadas);
 
     
  }



      
  const getNombreComprador = async (idComprador) => {
    if (compradores[idComprador]) {
      return compradores[idComprador]; // Si ya lo tenemos, devolverlo
    }
  const responseNombreComprador= await fetch(`http://54.87.25.132/compradores/${idComprador}`,{
      method:'GET',
      headers:{
                  'Content-Type': 'application/json',
                     'authorization': `Bearer ${token}`
      }
    })
    if (!responseNombreComprador.ok) {
      throw new Error(`HTTP error! status: ${ responseNombreComprador.status}`);
  }
   // url del endpoint de la api
  const data = await  responseNombreComprador.json();
  const nombre = data.User.nombreCompleto;

  setCompradores((prev) => ({ ...prev, [idComprador]: nombre })); // Almacenamos el nombre en el estado
  return nombre;
}
  
const getNombreProducto= async (idArticulo) => {
  if (articulos[idArticulo]) {
    return articulos[idArticulo]; // Si ya lo tenemos, devolverlo
  }
const responseNombreArticulo= await fetch(`http://54.87.25.132/articulos/${idArticulo}`,{
    method:'GET',
    headers:{
                'Content-Type': 'application/json',
                   'authorization': `Bearer ${token}`
    }
  })
  if (!responseNombreArticulo.ok) {
    throw new Error(`HTTP error! status: ${ responseNombreArticulo.status}`);
}
const data = await responseNombreArticulo.json();
const nombreArticulo = data.nombre;
setArticulos((prev) => ({ ...prev, [idArticulo]: nombreArticulo }));
return nombreArticulo;
}

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

    loadFactura();
  }, []);



  return (
    <div>
      <Navbar/>
      <div className={estilo.container}>
      {mostrarPendientes ? (
        <h2>Pedido Pendientes:</h2>
      ) : ( 
        <h2>Pedido Completados:</h2>
      )}
        <div className={estilo.grupoBtns}>
            <button className={estilo.btn1} onClick={() => setMostrarPendientes(true)}>Pendientes</button>
            <button className={estilo.btn2}onClick={() => setMostrarPendientes(false)}>Completados</button>
        </div>
        
       {mostrarPendientes ? (
          facturasPendientes.map((factura) => (
            <Tarjeta
              key={factura.idItemFactura}
              numero={factura.Factura.idFactura}
              idComprador={factura.Factura.idComprador}
              precio={factura.subTotal}
              fecha={factura.createdAt}
              nombreArticulo={<NombreArticulo idArticulo={factura.idArticulo} getNombreProducto={getNombreProducto} />}
              nombreComprador={<NombreComprador idComprador={factura.Factura.idComprador} getNombreComprador={getNombreComprador} />}
              cantidad={factura.cantidad}
              direccion={factura.direccionEnvio}
              estado={factura.estado}
              idItemFactura={factura.idItemFactura}
            />
          ))
        ) : (
          facturasCompletadas.map((factura) => (
            <Tarjeta
              key={factura.idItemFactura}
              numero={factura.Factura.idFactura}
              idComprador={factura.Factura.idComprador}
              precio={factura.subTotal}
              fecha={factura.createdAt}
              nombreArticulo={<NombreArticulo idArticulo={factura.idArticulo} getNombreProducto={getNombreProducto} />}
              nombreComprador={<NombreComprador idComprador={factura.Factura.idComprador} getNombreComprador={getNombreComprador} />}
              cantidad={factura.cantidad}
              direccion={factura.direccionEnvio}
              estado={factura.estado}
              idItemFactura={factura.idItemFactura}
            />
          ))
        )}
       
      </div>
      <Footer/>
    </div>
  )
}

const NombreComprador = ({ idComprador, getNombreComprador }) => {
  const [nombre, setNombre] = useState(null);

  useEffect(() => {
    const fetchNombre = async () => {
      const nombreComprador = await getNombreComprador(idComprador); // Aquí usamos getNombreComprador correctamente
      setNombre(nombreComprador);
    };

    fetchNombre();
  }, [idComprador, getNombreComprador]); // Aseguramos que la función se mantenga estable y no cause ciclos infinitos

  return <span>{nombre ? nombre : 'Cargando...'}</span>;
};



const NombreArticulo = ({ idArticulo, getNombreProducto }) => {
  const [nombreProducto, setNombreProducto] = useState(null);

  useEffect(() => {
    const fetchNombreArticulo = async () => {
      const nombreArticulo = await getNombreProducto(idArticulo); // Aquí se usa `getNombreProducto` correctamente
      setNombreProducto(nombreArticulo);
    };

    fetchNombreArticulo();
  }, [idArticulo, getNombreProducto]);

  return <span>{nombreProducto ? nombreProducto : 'Cargando...'}</span>;
};