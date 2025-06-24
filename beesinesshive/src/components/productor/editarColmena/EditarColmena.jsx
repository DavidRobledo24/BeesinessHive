import React, { useState, useRef, useEffect } from "react";

import imgHive from "../../../assets/colmena.png";
import Style from "../crearColmena/creaStyle.module.css";
import style from "../../inicio/inicio.module.css";
/*Componentes */
import Navbar from "../../general/navbar/Navbar";
import Footer from "../../general/footer/Footer";
/*iconos*/
import HiveIcon from "@mui/icons-material/Hive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Swal from 'sweetalert2';
// ``advertencia este codigo no tiene logica solo visual, si busca funcionalidad no se ejecutara, asi que reorganice los datos que realmente necesite``

export default function EditarColmena() {
  const location = useLocation(); // Obtén el estado desde la ubicación actual
const { idColmena} = location.state || {}; // Extrae el idApiario del estado

const [nombreError, setNombreError] = useState(false);
const [estadoError, setEstadoError] = useState(false);
const [cuerposError, setCuerposError] = useState(false);
const [panalesError, setPanalesError] = useState(false);
const [origenError, setOrigenError] = useState(false);
const [ingresoError, setIngresoError] = useState(false);
const [nacimientoError, setNacimientoError] = useState(false);
const [colorError, setColorError] = useState(false);
const [Colmena, setColmena]=useState();
const { user, login, logout } = useAuth();
const token = user?.token; 
const navigate = useNavigate();

const form = useRef();

    const [values, setValues] = useState({
        nombre:"",
        estado:"",
        cuerpos:0,
        panales:0,
        reinaOrigen:" ",
        reinaFechaIngreso: "",
        reinaFechaNacimiento:"",
        reinaColor:"",
        descripcion:"",
        idApiario: 0
        
    
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
              else if(decodedToken.role === "productor" && !idColmena) navigate("/gestionApiarios");
            }
        })
        colmenaFetch();
    }, []);

      const colmenaFetch = async () => {
        try {
            const response = await fetch(`http://54.87.25.132/colmenas/${idColmena}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}` // Incluye el token aquí
                }
            });
          
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setColmena(data);
            setValues({
              nombre:data.nombre,
              estado:data.estado,
              cuerpos:data.cuerpos,
              panales:data.panales,
              reinaOrigen:data.reinaOrigen,
              reinaFechaIngreso:data.reinaFechaIngreso,
              reinaFechaNacimiento:data.reinaFechaNacimiento,
              reinaColor:data.reinaColor,
              descripcion:data.descripcion,
              idApiario:data.idApiario
            });
            
            console.log("este es  la colmena en editar ",data);
            //setArticulos(data);
            
        } catch (error) {
            console.error("Error fetching hives:", error);
        }
    };

    const handleDelete = async () => {
      const confirm = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará la colmena y no podrá ser deshecha.',
        icon: 'warning', 
        iconHtml: '🗑️',
        background: 'linear-gradient(to right, #FFA500,  #FF7F50  )',
        color: '#fff', 
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        buttonsStyling: false,
        customClass: {
          popup: '',
          confirmButton: '',
          cancelButton: '',
        },
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
          confirmButton.style.marginRight = '10px';
      
          const cancelButton = popup.querySelector('.swal2-cancel');
          cancelButton.style.backgroundColor = '#FF6347';
          cancelButton.style.color = '#fff';
          cancelButton.style.border = 'none';
          cancelButton.style.borderRadius = '10px';
          cancelButton.style.padding = '10px 20px';
          cancelButton.style.fontSize = '16px';
          cancelButton.style.cursor = 'pointer';
          cancelButton.style.boxShadow = '0px 4px 10px rgba(0, 0, 0, 0.3)';
          confirmButton.style.marginLeft = '10px';
        },
      });
    
      if (confirm.isConfirmed) {
        try {
          const response = await fetch(`http://54.87.25.132/colmenas/${idColmena}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token}`,
            },
          });
    
          if (response.ok) {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La colmena ha sido eliminada.',
              icon: 'success',// esto da el color que esta alrededor de icono
              iconHtml: '🗑️',
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
    
            // Redirige a la vista de colmenas
            navigate('/GestionarColmenas', { state: { idApiario: values.idApiario } });
          } else {
            Swal.fire({
              title: '¡Error!',
              text: `No se pudo eliminar la colmena. Código de estado: ${response.status}`,
              icon: 'error',// esto da el color que esta alrededor de icono
              iconHtml: '❌',
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
          }
        } catch (error) {
          console.error('Error al eliminar:', error);
          Swal.fire({
            title: '¡Error!',
            text: 'Ocurrió un error al intentar eliminar la colmena.',
            icon: 'error',// esto da el color que esta alrededor de icono
            iconHtml: '❌',
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
        }
      }
    }; 
    
      function errorNombre(){
        setNombreError(false)
      }
      function errorEstado(){
        setEstadoError(false);
      }
      // function errorNacimiento(){
      //   setNacimientoError(false)
      // }
      // function errorOrigen(){
      //   setOrigenError(false)
      // }
      // function errorIngreso(){
      //   setIngresoError(false)
      // }
      // function errorColor(){
      //   setColorError(false)
      // }
      function errorPanales(){
        setPanalesError(false)
      }
      function errorCuerpos(){
        setCuerposError(false)
      }
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        let hasErrors = false;
    
        // Validaciones de los campos
        if (values.nombre.length < 3) {
          setNombreError(true);
          hasErrors = true;
        } else {
          setNombreError(false);
        }

        if(values.estado === ""){
          setEstadoError(true);
          hasErrors = true;
        }
        else{
          setEstadoError(false);
        }
    
        if (values.cuerpos <= 0) {
          setCuerposError(true);
          hasErrors = true;
        } else {
          setCuerposError(false);
        }
    
        if (values.panales <= 0) {
          setPanalesError(true);
          hasErrors = true;
        } else {
          setPanalesError(false);
        }
    
        // if (values.reinaOrigen.length < 3) {
        //   setOrigenError(true);
        //   hasErrors = true;
        // } else {
        //   setOrigenError(false);
        // }
    
        // if (!values.reinaFechaIngreso) {
        //   setIngresoError(true);
        //   hasErrors = true;
        // } else {
        //   setIngresoError(false);
        // }
    
        // if (!values.reinaFechaNacimiento) {
        //   setNacimientoError(true);
        //   hasErrors = true;
        // } else {
        //   setNacimientoError(false);
        // }
    
        // if (values.reinaColor.length < 3) {
        //   setColorError(true);
        //   hasErrors = true;
        // } else {
        //   setColorError(false);
        // }
    
        if (hasErrors) {
          return;
        }
        try {
          const response = await fetch(`http://54.87.25.132/colmenas/${idColmena}`, {
            method: 'PUT',  // Usualmente, para actualizar datos se usa PUT
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token}`
            },
            body: JSON.stringify(values)  // Envía los valores actualizados
          });
       
          if(response.ok) {

            Swal.fire({
              title: '¡Éxito!',
              text: 'Colmena modificada correctamente.',
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
             
              navigate('/GestionarColmenas',{state:{idApiario:values.idApiario}});
            } else {
              alert(`Error: ${response.status}`);
            }
          
        
        } catch(error) {
          console.error('Error al actualizar:', error);
        
        }
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        const newValues = {
          ...values,
          [name]: value,
        };
        setValues(newValues);
      };
      const handleChangeState = (e) => {
        const { value } = e.target;
        setValues({ ...values, estado: value });
      };
      return (
        <>
          <Navbar />
    
          <div className={Style.create}>
            <h2>Editar Colmena:</h2>
            <form
              action=""
              onSubmit={handleSubmit}
              className="php-email-form"
              ref={form}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="columnLeft">
                <div>
                  <img
                    className={Style.center + " " + Style.image}
                    src={imgHive}
                    alt="image"
                  />
                  {/* <input type="image"></input> */}
                </div>
                <div className={style.box}>
                  <HiveIcon sx={{ fontSize: 20 }} className={style.icon} />
                  <input
                    type="text"
                    placeholder="Nombre del Panal"
                    name="nombre"
                    value={values.nombre}
                    onChange={handleChange}
                    onClick={errorNombre}
                  />
                  
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
                      El nombre del panal es requerido y debe tener al menos 3 caracteres.
                    </p>
                  ) : (
                    ""
                  )}
                <div className={style.box}>
                  <CheckCircleIcon sx={{ fontSize: 20 }} className={style.icon} />
                  <select
                    value={values.estado}
                    className="form-select"
                    name="estado"
                    onChange={handleChangeState}
                    onClick={errorEstado}
                  >
                    <option value="">Estado</option>
                    <option value="Activo">Activo</option>
                    <option value="Zanganera">Zanganera</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                {estadoError ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 15,
                        textAlign: "justify",
                        marginLeft: 15,
                      }}
                    >
                      El nombre del panal es requerido y debe tener al menos 3 caracteres.
                    </p>
                  ) : (
                    ""
                  )}
    
                <h3>Cantidades</h3>
                <div className={Style.boxed}>
                  <CalculateIcon sx={{ fontSize: 20 }} className={Style.icon} />
                  <input
                    type="text"
                    placeholder="Cuerpos"
                    value={values.cuerpos}
                    name="cuerpos"
                    style={{
                      border: "3px transparent solid",
                      borderRightColor: "#8D5604",
                      marginRight: "5px"
                    }}
                    onChange={handleChange}
                    onClick={errorCuerpos}
                  />
                  
    
                  <input
                    type="text"
                    placeholder="Panales"
                    name="panales"
                    value={values.panales}
                    onChange={handleChange}
                    onClick={errorPanales}
                  />
                  
                </div>
                {cuerposError ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 15,
                        textAlign: "justify",
                        marginLeft: 15,
                      }}
                    >
                      Debes ingresar un número mayor a 0.
                    </p>
                  ) : (
                    ""
                  )}
              {panalesError ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 15,
                        textAlign: "justify",
                        marginLeft: 15,
                      }}
                    >
                      Debes ingresar un número mayor a 0.
                    </p>
                  ) : (
                    ""
                  )}
              </div>
              
              <div className="columnRight">
                
                <h3>Otro</h3>
                <textarea
                  className={style.box + " " + Style.textarea}
                  name="descripcion"
                  placeholder="Descripción"
                  value={values.descripcion}
                  rows={16}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className={Style.groupBtns}>
                    <button type='button' className={Style.btnB} onClick={handleDelete}>Borrar</button>
                    <button className={Style.btnG} onClick={handleSubmit} type='submit'>Guardar</button>
                </div>
            </form>

          </div>
          <Footer />
        </>
      );
}
