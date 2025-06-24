import React, { useState, useRef, useEffect } from "react";
import recycledStyle from "../crearColmena/creaStyle.module.css"
import Style from "../crearProducto/crearproducto.module.css"
import style from "../../inicio/inicio.module.css";

import Navbar from "../../general/navbar/Navbar"
import Footer from "../../general/footer/Footer"
import Swal from 'sweetalert2'
import imgProduct from "../../../assets/objeto.png";
import ArticleIcon from "@mui/icons-material/Article";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalculateIcon from "@mui/icons-material/Calculate";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useAuth } from '../../general/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function EditarProducto() {
  
      const [nombreError, setNombreError] = useState(false);
      const [descripcionError, setDescripcionError] = useState(false);
      const [precioError, setPrecioError] = useState(false);
      const [cantidadError, setCantidadError] = useState(false);
      const [publicado, setPublicado] = useState(3);
      const [categoriaError, setCategoriaError] = useState(false);
      const [imagenError, setImagenError] = useState(false);
      const { user, login, logout } = useAuth();
      const token = user?.token; 
      const location = useLocation(); // Obtén el estado desde la ubicación actual
      const { idArticulo,nombre, descripcion, imagen, precio, cantidad, categoria } = location.state || {}; 
      const navigate = useNavigate();
      const form = useRef();

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
     function errorCategoria() {
        setCategoriaError(false);
      }

      const [values, setValues] = useState({
        nombre,
        descripcion,
        precio,
        cantidad,
        categoria,
        imagen
        
      });

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
              else if(decodedToken.role === "productor" && !idArticulo) navigate("/MarketplaceProd");
            }
        })
    
      }, []);

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
 //////////////////////////
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
    
        await fetch(`http://54.87.25.132/articulos/${idArticulo}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values),
        })
          .then((response) => {
            if (response.status === 200) {

            Swal.fire({
              title: '¡Éxito!',
              text: 'Articulo modificado correctamente.',
              icon: 'success',// esto da el color que esta alrededor de icono
              iconHtml: '✍🏼',
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
              title: "No fue posible modificar el articulo por un error interno del servidor ",
              icon: "error"
          })
          });
          document.getElementById("formArticulo").reset();
      };
    
     
      return (
        <>
          <Navbar />
    
          <div className={recycledStyle.create}>
            <h2>Editar Producto:</h2>
            <form
                     id="formArticulo"
                     action=""
                     //onSubmit={handleSubmit}
                     className="php-email-form"
                     ref={form}
                     data-aos="fade-up"
                     data-aos-delay="200"
            >

              <div className="columnLeft">
            <div>
          
             <div>
             <img
                    className={recycledStyle.center + " " + recycledStyle.image}
                    src={imagen}
                    alt="imagen del producto"
                   
           
                  />
            
      </div>
             

     {/* nombre del producto */}
              <div className={style.box}>
                <ArticleIcon sx={{ fontSize: 20 }} className={style.icon} />
                <input type="text" id="nombre" value={values.nombre} name="nombre" onChange={handleChange} onClick={errorNombre} placeholder="Nombre del producto" />
              </div>
              {nombreError ? (
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
              ) : (
                ""
              )}



            {/* descripcion del producto  */}
              <textarea className={style.box + " " + recycledStyle.textarea} id="descripcion"  name="descripcion" onChange={handleChange} onClick={errorDescripcion} value={values.descripcion} placeholder="Descripción" rows={6} ></textarea>
          
            </div>
          </div>

             {/* precio */}

          <div className="columnRight">
            <div className={style.box}>
              <AttachMoneyIcon sx={{ fontSize: 20 }} className={style.icon} />
              <input type="number" id="precio" name="precio" value={values.precio} onChange={handleChange} onClick={errorPrecio} placeholder="Precio" />

            </div>
            {precioError ? (
              <p
                style={{
                  color: "red",
                  fontSize: 15,
                  textAlign: "justify",
                  marginLeft: 15,
                }}
              >
                El precio es requerido y debe tener al menos 1 caracter.
              </p>
            ) : (
              ""
            )}

   {/* cantidad */}

            <div className={style.box}>
              <CalculateIcon sx={{ fontSize: 20 }} className={style.icon} />
              <input type="text" id="cantidad" name="cantidad" value={values.cantidad} onChange={handleChange} onClick={errorCantidad} placeholder="Cantidad" />
            </div>
            {cantidadError ? (
              <p
                style={{
                  color: "red",
                  fontSize: 15,
                  textAlign: "justify",
                  marginLeft: 15,
                }}
              >
                la cantidad es requerida y debe tener al menos 1 caracter.
              </p>
            ) : (
              ""
            )}

               {/*categorias  */}

            <h3>categorias</h3>
            <div className={Style.creacion}>
              <div className={style.box}>
                <select
                value={values.categoria}
                 type="text"
                  className="form-select"
                  name="categoria"
                 // onChange={handleChange} 
                  onClick={errorCategoria}
                  onChange={handleChangeState}
                >
                  <option value="">Categoria</option>
                  <option value="Miel">Miel</option>
                  <option value="Polen">Polen</option>
                  <option value="Propoleo">Propoleo</option>
                  <option value="Cera de abeja">Cera de abeja</option>
                  <option value="Apitoxina">Apitoxina</option>
                  <option value="Jalea Real">Jalea Real</option>
                  <option value="Productos transformados">Productos transformados</option>
                  <option value="Cosméticos">Cosméticos</option>
                  <option value="Reinas">Reinas</option>
                  <option value="Colmenas">Colmenas</option>
                  <option value="Nucleos">Nucleos</option>
                  <option value="Servicios Polinizacion">Servicios Polinizacion</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              {categoriaError ? (
                <p
                  style={{
                    color: "red",
                    fontSize: 15,
                    textAlign: "justify",
                    marginLeft: 15,
                  }}
                >
                  Elija una categoria.
                </p>
              ) : (
                ""
              )}
              {/* <button className={style.btnPrincipal+" "+Style.category }>
                <AddRoundedIcon  sx={{ fontSize: 50 }} className={style.icon}></AddRoundedIcon>
                Añadir Categoria</button> */}
            </div>
          </div>
    

    
            
              
              <div className={recycledStyle.groupBtns}>
                    <button type='button' className={recycledStyle.btnB}>Borrar</button>
                    <button className={recycledStyle.btnG}  onClick={handleSubmit} type='submit'>Guardar</button>
                </div>
          
            </form>
            </div>
    
          <Footer />
        </>
      );
}