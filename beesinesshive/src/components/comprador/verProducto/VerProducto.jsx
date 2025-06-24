import React, { useState, useEffect } from 'react';
import Navbar from '../../general/navbar/Navbar'
import Footer from '../../general/footer/Footer'
import Estrellas from './Estrellas'
import Style from '../../inicio/inicio.module.css'
import estilo from './verProducto.module.css'
import valentina from '../../../assets/valentina.jpg'

import { useAuth } from '../../general/context/AuthContext';
import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function VerProducto() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

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
  }, []);

  const { id } = useParams();
  const { user, login, logout } = useAuth();
  const token = user?.token;

  const [articulo, setArticulo] = useState([]);
  const [productor, setProductor] = useState([]);
  const [userInfo, setUserInfo] = useState([]);


  const fetchArticulo = async () => {
    try {

      const response = await fetch(`http://54.87.25.132/articulos/${id}`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}` // Incluye el token aquí
        }

      });

      const data = await response.json();
      setArticulo(data)
      setProductor(data.Productor)
   
      try {

        const responseUser = await fetch(`http://54.87.25.132/users/${data.Productor.idUsuario}`, {
          method: 'GET',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          }
        });

        const dataUser = await responseUser.json();
        setUserInfo(dataUser)

      }
      catch (error) {
        Swal.fire("Error", "No se ha podido revisar la información del usuario");
      }
    } catch (error) {
      Swal.fire("Error", "No se ha podido cargar los detalles del Articulo");
    }


  };
  const goChat= async ()=>{
     navigate('/ChatByComprador',{state:{idProductor:articulo.idProductor}} )
  }

  useEffect(() => {
    fetchArticulo();
  }, []);

  return (
    <div>
      <Navbar />
      <div className={estilo.container}>
        <div className={estilo.left}>
          <div className={estilo.warning}>
            <p>Este es el inicio de la venta de productos apicolas, estamos buscando mejorar nuestra experiencia de usuario.
              <br />
              <br />
              Para comprar los productos que más te gusten contacta directamente al apicultor en nuestro chat directo para más información y definir la forma de entrega y pago.
            </p>
          </div>
          <div className={estilo.infoProducto}>
            <h2>Producto</h2>
            {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  style={{
                    fontSize: '3rem',
                    color: 'gold'
                  }}
                >
                  ★
                </span>
              ))}
            </div> */}
            {/*MODIFICAR CODIGO PARA QUE SE MUESTRE EL PROMEDIO DED ESTRELLAS  */}
            <img src={articulo.imagen} className={estilo.imagen} />
            <div className={estilo.texto}>
              <h3 className={estilo.titulo}>{articulo.nombre}</h3>
              <p>{articulo.descripcion}</p>
              <p><strong>Categorias: </strong>{articulo.categoria}</p>
              <h2 className={estilo.price}>{articulo.precio} COP</h2>
              <p className={estilo.cant}>Cantidad disponible: <br />
              <h2 className={estilo.price}>{articulo.cantidad} Unidades</h2>
              </p>
            </div>
          </div>
        </div>
        <div className={estilo.right}>
          <div className={estilo.contentInfo}>
            <h3>Empresa</h3>
            <p>{productor.empresa}</p>
            <h3>Producto</h3>
            <p>{articulo.nombre}</p>
            <h3>Productor</h3>
            <p>{userInfo.nombreCompleto}</p>
            <h3>Lugar</h3>
            <p>{userInfo.departamento}</p>
            <h3>Teléfono</h3>
            <p>{userInfo.numero}</p>
            <h3>Correo electrónico</h3>
            <p>{userInfo.correo}</p>
          </div>
          {/* <div className={estilo.starts}>
            <h2>Calificar Producto</h2>
            <Estrellas onRatingChange={handleRatingChange} />
          </div> */}
          <div className={estilo.contentbtn}>
            <Link to={"/MarketPlaceComp"} className={Style.btnPrincipal} style={{ padding: '15px 10%', borderRadius: '20px', margin: 'auto 10px' }}>Volver</Link>
            <button className={Style.btnPrincipal} style={{ padding: '15px 10%', borderRadius: '20px', margin: 'auto 10px' }} onClick={goChat}>Chat</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
