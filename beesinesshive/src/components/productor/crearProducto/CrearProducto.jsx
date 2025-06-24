import recycledStyle from "../crearColmena/creaStyle.module.css";
import Style from "./crearproducto.module.css";
import style from "../../inicio/inicio.module.css";
import Navbar from "../../general/navbar/Navbar";
import Footer from "../../general/footer/Footer";
import React, { useState, useRef, useEffect } from "react";

import imgProduct from "../../../assets/objeto.png";
import ArticleIcon from "@mui/icons-material/Article";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalculateIcon from "@mui/icons-material/Calculate";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Swal from 'sweetalert2'
import { useAuth } from '../../general/context/AuthContext';

import { useNavigate } from 'react-router-dom';

export default function CrearProducto() {
  
  const [nombreError, setNombreError] = useState(false);
  const [descripcionError, setDescripcionError] = useState(false);
  const [precioError, setPrecioError] = useState(false);
  const [cantidadError, setCantidadError] = useState(false);
  const [publicado, setPublicado] = useState(3);
  const [categoriaError, setCategoriaError] = useState(false);
  const [imagenError, setImagenError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [imagenBase64, setImagenBase64] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const token = user?.token; 
  const form = useRef();

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
  }, []);


  function errorNombre() {
    setNombreError(false);
  }
  function errorDescripcion() {
    setDescripcionError(false);
  }
  function errorPrecio() {
    setPrecioError(false);
  }
  function errorCantidad() {
    setCantidadError(false);
  }
  
  // function errorPublicado() {
  //   setPublicadoError(false);
  // }
  
 function errorCategoria() {
    setCategoriaError(false);
  }
 function errorImagen() {
    setImagenError(false);
  }
  
  function errorIdProductor() {
    setIdProductorError(false);
  }


  const [values, setValues] = useState({
    nombre: "",
    descripcion: "",
    precio:0,
    cantidad:"",
    publicado: publicado,
    categoria:"",
    imagen:""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValues = {
      ...values,
      [name]: name === "precio" ? Number(value) : value,
    };
    setValues(newValues);
  };
  



  const handleChangeState = (e) => {
    const { value } = e.target;
    setValues({ ...values, categoria: value });
  };
  

  ////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;


    // Validaciones de los campos
    if(values.imagen === ""){
      setImagenError(true);
      hasErrors = true;
    }
    else{
      setImagenError(false);
    }

    if (values.nombre.length < 3) {
      setNombreError(true);
      hasErrors = true;
    } else {
      setNombreError(false);
    }
   
    if (values.descripcion.length <= 0) {
      setDescripcionError(true);
      hasErrors = true;
    } else {
      setDescripcionError(false);
    }

    if (values.precio <= 0) {
      setPrecioError(true);
      hasErrors = true;
    } else {
      setPrecioError(false);
    }

    if (values.cantidad <=0) {
      setCantidadError(true);
      hasErrors = true;
    } else {
      setCantidadError(false);
    }

    if (values.categoria.length <= 0) {
      setCategoriaError(true);
      hasErrors = true;
    } else {
      setCategoriaError(false);
    }

    if (hasErrors) {
      return;
    }
      
    
    

    await fetch("http://localhost:3005/articulos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'authorization': `Bearer ${token}` // Incluye el token aquí
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.status === 200) {
          
        Swal.fire({
          title: '¡Éxito!',
          text: 'Articulo creado correctamente.',
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
        form.current.reset();
        navigate('/MarketplaceProd');
       
        } else {
          alert(`Error: ${response.status}`);
        }
      })
      .catch((error) => {
        Swal.fire({
          title: "No fue posible crear el articulo por un error interno del servidor ",
          icon: "error"
      })
      });
      
      setImagenBase64(null);
       document.getElementById("formArticulo").reset();
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true); // Activar estado de carga
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenBase64(reader.result); // Convertimos la imagen a Base64
        setValues({ ...values, imagen: reader.result }); // Guardamos la imagen en el estado
        setIsUploading(false); // Desactivar estado de carga
      };
      reader.readAsDataURL(file); // Leemos el archivo como una URL de datos (Base64)
    }
  };
  

  return (
    <>
  <Navbar />

  <div className={recycledStyle.create}>
    <a href="#" className={style.regreso}>Volver</a>
    <h2>Crear Producto:</h2>
    {message && <p>{message}</p>}

    <form
      id="formArticulo"
      action=""
      className="php-email-form"
      ref={form}
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <div className="columnLeft">
        <div>
          {/* Imagen de carga*/}
          {isUploading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p className="spinner-text">Cargando imagen...</p>
            </div>
          ) : (
            <img
              className={`${recycledStyle.center} ${recycledStyle.image}`}
              src={imagenBase64 || imgProduct} // Mostramos la imagen cargada o una imagen por defecto
              alt="imagen del producto"
            />
          )}

          {/* Input para subir imagen */}
          <label htmlFor="upload-image" className={style.box}>
            <div style={{ cursor: "pointer" }}>
              <AddAPhotoIcon sx={{ fontSize: 20 }} className={style.icon} />
              <span>Subir Imagen</span>
            </div>
          </label>
          <input
            type="file"
            id="upload-image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
            onClick={errorImagen}
          />

          {/* Mensaje de error para imagen */}
          {imagenError ? (
            <p
              style={{
                color: "red",
                fontSize: 15,
                textAlign: "justify",
                marginLeft: 15,
              }}
            >
              Ingrese una imagen.
            </p>
          ) : null}
        </div>

        {/* Nombre del producto */}
        <div className={style.box}>
          <ArticleIcon sx={{ fontSize: 20 }} className={style.icon} />
          <input
            type="text"
            id="nombre"
            name="nombre"
            onChange={handleChange}
            onClick={errorNombre}
            placeholder="Nombre del producto"
          />
        </div>
        {nombreError && (
          <p
            style={{
              color: "red",
              fontSize: 15,
              textAlign: "justify",
              marginLeft: 15,
            }}
          >
            El nombre es requerido y debe tener al menos 3 caracteres.
          </p>
        )}

        {/* Descripción del producto */}
        <textarea
          className={style.box + " " + recycledStyle.textarea}
          id="descripcion"
          name="descripcion"
          onChange={handleChange}
          onClick={errorDescripcion}
          placeholder="Descripción"
          rows={6}
        ></textarea>
        {descripcionError && (
          <p
            style={{
              color: "red",
              fontSize: 15,
              textAlign: "justify",
              marginLeft: 15,
            }}
          >
            Ingrese una descripción.
          </p>
        )}
      </div>

      <div className="columnRight">
        {/* Precio */}
        <div className={style.box}>
          <AttachMoneyIcon sx={{ fontSize: 20 }} className={style.icon} />
          <input
            type="number"
            id="precio"
            name="precio"
            onChange={handleChange}
            onClick={errorPrecio}
            placeholder="Precio"
          />
        </div>
        {precioError && (
          <p
            style={{
              color: "red",
              fontSize: 15,
              textAlign: "justify",
              marginLeft: 15,
            }}
          >
            El precio es requerido y debe ser mayor a 0.
          </p>
        )}

        {/* Cantidad */}
        <div className={style.box}>
          <CalculateIcon sx={{ fontSize: 20 }} className={style.icon} />
          <input
            type="text"
            id="cantidad"
            name="cantidad"
            onChange={handleChange}
            onClick={errorCantidad}
            placeholder="Cantidad"
          />
        </div>
        {cantidadError && (
          <p
            style={{
              color: "red",
              fontSize: 15,
              textAlign: "justify",
              marginLeft: 15,
            }}
          >
            La cantidad es requerida y debe ser mayor a 0.
          </p>
        )}

        {/* Categorías */}
        <h3>Categorías</h3>
        <div className={Style.creacion}>
          <div className={style.box}>
            <select
              type="text"
              className="form-select"
              name="categoria"
              onClick={errorCategoria}
              onChange={handleChangeState}
            >
              <option value="">Categoría</option>
              <option value="Miel">Miel</option>
              <option value="Polen">Polen</option>
              <option value="Propoleo">Propóleo</option>
              <option value="Cera de abeja">Cera de abeja</option>
              <option value="Apitoxina">Apitoxina</option>
              <option value="Jalea Real">Jalea Real</option>
              <option value="Productos transformados">
                Productos transformados
              </option>
              <option value="Cosméticos">Cosméticos</option>
              <option value="Reinas">Reinas</option>
              <option value="Colmenas">Colmenas</option>
              <option value="Núcleos">Núcleos</option>
              <option value="Servicios Polinización">Servicios Polinización</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          {categoriaError && (
            <p
              style={{
                color: "red",
                fontSize: 15,
                textAlign: "justify",
                marginLeft: 15,
              }}
            >
              Elija una categoría.
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        type="submit"
        className={style.btnPrincipal + " " + recycledStyle.btnCreate}
      >
        Crear
      </button>
    </form>
  </div>

  <Footer />
</>
  );
}
