import React, { useState, useEffect, useRef } from 'react';
import style from '../../../inicio/inicio.module.css'
import './generadorFactura.css';
import InventoryIcon from '@mui/icons-material/Inventory';
import CalculateIcon from '@mui/icons-material/Calculate';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../general/context/AuthContext';
import { useLocation } from 'react-router-dom';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../general/navbar/Navbar'
import Footer from '../../../general/footer/Footer'

const GenerarFactura = () => {

  const [direccionEnvio, setDireccionEnvio] = useState('');
  //const [cantidad, setCantidad] = useState('1'); // Por defecto, cantidad es 1
  const [total, setTotal] = useState(0);
  const [productos, setProductos] = useState([]);  // Array para guardar los productos
  const [selectedProducto, setSelectedProducto] = useState(null);  // Para almacenar el producto seleccionado
  const [cantidad, setCantidad] = useState('0');
  ///////////////////
  const [values, setDatafacura] = useState({
    idComprador: 0,
    total: 0,
    direccionEnvio: "",
    cantidad: 1,
    idArticulo: 0,
    estado: "pendiente"

  });

  const location = useLocation(); // Obtén el estado desde la ubicación actual
  const { IdConversacion, vendedorId } = location.state || {};
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
        else if(response.status == 200){
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          if(decodedToken.role === "comprador") navigate("/");
          else if(decodedToken.role === "productor" && (!IdConversacion, !vendedorId)) navigate("/NotificacionesChat");
        }
    })
  }, []);

  useEffect(() => {



    // Verificar si tenemos IdConversacion y vendedorId
    if (IdConversacion && vendedorId) {
      const vendedorIdStr = vendedorId.toString();

      // Reemplazar vendedorIdStr de la cadena IdConversacion
      const idProductorStr = IdConversacion.replace(vendedorIdStr, '');

      // Verificar que la cadena no esté vacía
      if (idProductorStr === '') {
        console.error("La cadena después del reemplazo está vacía, no se pudo separar correctamente.");
        return;
      }

      // Convertir el resultado a un número
      const idComprador = parseInt(idProductorStr, 10);

      if (isNaN(idComprador)) {
        console.error("No se pudo convertir idProductorStr a número:", idProductorStr);
        return;
      }

      // Actualizar el estado con el idComprador
      setDatafacura(prevState => ({
        ...prevState,  // Mantener el resto del estado
        idComprador: idComprador
      }));
    } else {
      console.error("Faltan datos: IdConversacion o vendedorId no están definidos.");
    }

    const getArticulosbyProductor = async () => {


      try {
        const responseProductos = await fetch(`http://54.87.25.132/articulos/productor/${vendedorId}`, {
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}` // Incluye el token aquí
          },
        })

        if (!responseProductos.ok) {
          const errorMessage = await responseProductos.text();
          throw new Error(`Network response was not ok: ${errorMessage}`);
        }

        const data = await responseProductos.json();

        setProductos(data);

      } catch (error) {
        console.error('Error en la petición:', error);
      }
    }
    getArticulosbyProductor();


  }, [IdConversacion, vendedorId]); // Dependencias de useEffect para ejecutar la lógica cuando cambien IdConversacion o vendedorId



  const handleSelectProducto = (e) => {
    const selectedProductoName = e.target.value;

    // Encontramos el producto seleccionado en el array
    const productoSeleccionado = productos.find(prod => prod.nombre === selectedProductoName);

    if (productoSeleccionado) {
      setSelectedProducto(productoSeleccionado);  // Almacenamos el producto seleccionado
      setDatafacura(prevState => ({
        ...prevState,
        idArticulo: productoSeleccionado.idArticulo,  // Actualizamos el idArticulo
      }));
    }
  };

  const handleCantidadChange = (e) => {
    const cantidadInput = e.target.value;

    // Si la cantidad es vacía, considera como 0
    if (cantidadInput === '') {
      setCantidad('0');  // Establece cantidad como 0 si el campo está vacío
    } else {
      setCantidad(cantidadInput);  // Actualiza la cantidad en el estado

      // Si tenemos un producto seleccionado, recalculamos el total
      if (selectedProducto) {
        const totalCalculado = cantidadInput * selectedProducto.precio;
        setTotal(totalCalculado);  // Actualizamos el total en el estado
        setDatafacura(prevState => ({
          ...prevState,
          cantidad: cantidadInput,  // Actualizamos la cantidad en el estado
          total: totalCalculado,    // Actualizamos el total en el estado
        }));
      }
    }
  };



  const handleSubmit = async () => {
    const { idComprador, total, direccionEnvio, cantidad, idArticulo, estado } = values;


    if (!idComprador || !total || !direccionEnvio || !cantidad || !idArticulo || !estado) {
      Swal.fire('Error', 'Faltan datos necesarios para registrar la factura', 'error');
      return;
    }
    const cantidadInt = parseInt(cantidad, 10); // Base 10
    if (isNaN(cantidadInt)) {
      return res.status(400).json({ error: "El campo 'cantidad' debe ser un número válido" });
    }

    try {
      const responseFactura = await fetch('http://54.87.25.132/facturas', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}` // Incluye el token aquí
        },
        body: JSON.stringify({
          idComprador,
          total,
          direccionEnvio,  // Se debe incluir la dirección
          cantidad: cantidadInt,     // Aunque no lo uses para la creación, se puede enviar
          idArticulo,
          estado

        }),
      })
      const data = await responseFactura.json();
      if (responseFactura.ok) {

        Swal.fire({
          title: '¡Éxito!',
          text: 'Se ha generado la factura correctamente.',
          icon: 'success',// esto da el color que esta alrededor de icono
          iconHtml: '🐝',
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
        //form.current.reset(); // Si es necesario, resetear el formulario aquí

        //navigate('/ChatComprador', { state: { IdConversacion, vendedorId: data.idProductor } });
        navigate('/principalCards');
      } else {
        Swal.fire('Error', 'Ha fallado el registro de la factura', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No fue posible el proceso de registro por un error', 'error');
    }

  };




  return (
    <>
    <Navbar/>
    <div className='generator'>
    <a href="#" className={style.regreso}>volver</a>
      <h2>Beesiness<span>Message</span></h2>
      <form action='' className='generator__form'>
        <label htmlFor="direction"></label>
        <div className="productForm">
          <div className={style.box}>
            <LocationOnIcon className='icon' />
            <input
              type='text'
              placeholder='Dirección de envío'
              id='direction'
              name='direccionEnvio'
              value={direccionEnvio}
              onChange={(e) => {
                setDireccionEnvio(e.target.value);
                setDatafacura((prevState) => ({
                  ...prevState,
                  direccionEnvio: e.target.value, // Actualizamos la dirección
                }));
              }}
            />
          </div>

          <label htmlFor="produc"></label>

          <div className={style.box}>
            <InventoryIcon className='icon' />
            <select
              value={selectedProducto ? selectedProducto.nombre : ""}
              id="produc"
              onChange={handleSelectProducto}
            >
              <option value="" disabled>Producto</option>
              {productos.map((prod) => (
                <option key={prod.idArticulo} value={prod.nombre}>
                  {prod.nombre}
                </option>
              ))}
            </select>
          </div>


          <div className={style.box}>
            <CalculateIcon className='icon' />
            <input
              type="number"
              placeholder="Cantidad"
              id="cantidad"
              name="cantidad"
              value={cantidad === '0' ? '' : cantidad}
              onChange={handleCantidadChange}  // Actualiza la cantidad y el total
            />
          </div>

          {/* <button className='btnAdd'>
            <span>
              <AddIcon />
            </span> <span >Añadir Producto</span>
          </button> */}
          <div className='total'>
            Total: {total} {/* Mostramos el total calculado */}
          </div>
        </div>

        <button onClick={handleSubmit} type='button' className='btnPrincipal btnGenerar'>Generar</button>
      </form>
    </div>
    <Footer/>
    </>
  );
};


export default GenerarFactura;



