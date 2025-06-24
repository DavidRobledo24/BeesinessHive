import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"; 
import Swal from "sweetalert2";
import imgHive from "../../../assets/colmena.png";
import Style from "./creaStyle.module.css";
import style from "../../inicio/inicio.module.css";
/*Componentes */
import Navbar from "../../general/navbar/Navbar";
import Footer from "../../general/footer/Footer";
/*iconos*/
import HiveIcon from "@mui/icons-material/Hive";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalculateIcon from "@mui/icons-material/Calculate";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import { useAuth } from '../../general/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function CrearColmena() {
 

  const [nombreError, setNombreError] = useState(false);
  const [estadoError, setEstadoError] = useState(false);
  const [cuerposError, setCuerposError] = useState(false);
  const [panalesError, setPanalesError] = useState(false);
  const [origenError, setOrigenError] = useState(false);
  const [ingresoError, setIngresoError] = useState(false);
  const [nacimientoError, setNacimientoError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const { user, login, logout } = useAuth();
  const token = user?.token; 
  const location = useLocation(); // Obtén el estado desde la ubicación actual
    const { idApiario,nombre } = location.state || {}; 
 
    const navigate = useNavigate();
  const form = useRef();
  const [values, setValues] = useState({
    nombre:"",
    estado:"",
    cuerpos:"",
    panales:"",
    reinaOrigen:" ",
    reinaFechaIngreso: "",
    reinaFechaNacimiento:"",
    reinaColor:"",
    descripcion:"",
    idApiario,

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
          else if(decodedToken.role === "productor" && !idApiario) navigate("/gestionApiarios");
        }
    })
  }, []);

  function errorNombre(){
    setNombreError(false)
  }
  function errorEstado(){
    setEstadoError(false);
  }
  function errorNacimiento(){
    setNacimientoError(false)
  }
  function errorOrigen(){
    setOrigenError(false)
  }
  function errorIngreso(){
    setIngresoError(false)
  }
  function errorColor(){
    setColorError(false)
  }
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

    if (values.reinaOrigen.length < 3) {
      setOrigenError(true);
      hasErrors = true;
    } else {
      setOrigenError(false);
    }

    if (!values.reinaFechaIngreso) {
      setIngresoError(true);
      hasErrors = true;
    } else {
      setIngresoError(false);
    }

    if (!values.reinaFechaNacimiento) {
      setNacimientoError(true);
      hasErrors = true;
    } else {
      setNacimientoError(false);
    }

    if (values.reinaColor.length < 3) {
      setColorError(true);
      hasErrors = true;
    } else {
      setColorError(false);
    }

    if (hasErrors) {
      return;
    }

    await fetch("http://54.87.25.132/colmenas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.status === 201) {

          Swal.fire({
            title: '¡Éxito!',
            text: 'colmena creada correctamente.',
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
          navigate('/GestionarColmenas',{ state: { idApiario, nombre } })
          
        } else {
          Swal.fire('Error', 'Ha fallado la creación de la colmena', 'error');
        }
      })
      .catch((error) => {
        Swal.fire('Error', 'Ha fallado la creación de la colmena', 'error');
      });
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
      <Link to='/GestionarColmenas' className={style.regreso}>Volver</Link>
        <h2>Crear Colmena:</h2>
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
                  Elija un estado
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
            <h3>Reina</h3>
            <div className={style.box}>
              <HiveIcon sx={{ fontSize: 20 }} className={style.icon} />
              <input
                type="text"
                placeholder="Origen"
                name="reinaOrigen"
                onChange={handleChange}
                onClick={errorOrigen}
              />
              
            </div>
            {origenError ? (
                <p
                  style={{
                    color: "red",
                    fontSize: 15,
                    textAlign: "justify",
                    marginLeft: 15,
                  }}
                >
                  El origen es requerido y debe tener al menos 3 caracteres.
                </p>
              ) : (
                ""
              )}
              <h4>fecha Ingreso</h4>
            <div className={style.box}>
              <CalendarMonthIcon sx={{ fontSize: 20 }} className={style.icon} />
              <input
                type="date"
                name="reinaFechaIngreso"
                placeholder="fecha Ingreso"
                onChange={handleChange}
                onClick={errorIngreso}
              />
              
            </div>
            {ingresoError ? (
                <p
                  style={{
                    color: "red",
                    fontSize: 15,
                    textAlign: "justify",
                    marginLeft: 15,
                  }}
                >
                  La fecha de ingreso es requerida.
                </p>
              ) : (
                ""
              )}
              <h4>fecha Nacimiento</h4>
            <div className={style.box}>
              <CalendarMonthIcon sx={{ fontSize: 20 }} className={style.icon} />
              <input
                type="date"
                name="reinaFechaNacimiento"
                onChange={handleChange}
                onClick={errorNacimiento}
              />
              
            </div>
            {nacimientoError ? (
                <p
                  style={{
                    color: "red",
                    fontSize: 15,
                    textAlign: "justify",
                    marginLeft: 15,
                  }}
                >
                  La fecha de nacimiento es requerida.
                </p>
              ) : (
                ""
              )}
            <div className={style.box}>
              <InvertColorsIcon sx={{ fontSize: 20 }} className={style.icon} />
              <input
                type="text"
                placeholder="Color"
                name="reinaColor"
                onChange={handleChange}
                onClick={errorColor}
              />
              
            </div>
            {colorError ? (
                <p
                  style={{
                    color: "red",
                    fontSize: 15,
                    textAlign: "justify",
                    marginLeft: 15,
                  }}
                >
                  El color es requerido y debe tener al menos 3 caracteres.
                </p>
              ) : (
                ""
              )}
            <h3>Otro</h3>
            <textarea
              className={style.box + " " + Style.textarea}
              name="descripcion"
              placeholder="Descripción"
              rows={6}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            type="submit"
            className={style.btnPrincipal + " " + Style.btnCreate}
          >
            Crear
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
