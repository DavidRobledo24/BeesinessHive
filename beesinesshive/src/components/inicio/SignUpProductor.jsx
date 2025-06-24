import Navbar from '../general/navbar/Navbar';
import Footer from '../general/footer/Footer';
import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import style from "./inicio.module.css";
import Colombia from "./colombia";
import PersonIcon from "@mui/icons-material/Person";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import MapIcon from "@mui/icons-material/Map";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BusinessIcon from "@mui/icons-material/Business";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

const SignUpProductor = () => {
  const usuario = useState("productor");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  }

  const [depIndex, setDepIndex] = useState(-1);
  const [munIndex, setMunIndex] = useState(-1);
  const [nombreCortoError, setNombreCortoError] = useState(false);
  const [nombreLargoError, setNombreLargoError] = useState(false);
  const [cedulaError, setCedulaError] = useState(false);
  const [cedulaNegativaError, setCedulaNegativaError] = useState(false);
  const [numeroError, setNumeroError] = useState(false);
  // const [correoError, setCorreoError] = useState(false);
  const [correoCortoError, setCorreoCortoError] = useState(false);
  const [correoLargoError, setCorreoLargoError] = useState(false);
  const [contrasenaError, setContrasenaError]=useState(false);
  const [contrasenaLargaError, setContrasenaLargaError] = useState(false);
  const [direccionCortaError, setDireccionCortaError] = useState(false);
  const [direccionLargaError, setDireccionLargaError] = useState(false);
  const [departamentoError, setDepartamentoError] = useState(false);
  const [municipioError, setMunicipioError] = useState(false);
  const [empresaVaciaError, setEmpresaVaciaError] = useState(false);
  const [empresaLargaError, setEmpresaLargaError] = useState(false);
  const [terminosCondiciones, setTerminosCondiciones] = useState(false);
  const [politicaPrivacidad, setPoliticaPrivacidad] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const navigate = useNavigate();
  const form = useRef()

  function dirError() {
    setDireccionCortaError(false);
    setDireccionLargaError(false);
  }
  function nameError(){
    setNombreCortoError(false);
    setNombreLargoError(false);
  }
  function cedError(){
    setCedulaError(false);
    setCedulaNegativaError(false);
  }
  
  function numError(){
    setNumeroError(false);
  }
    
  function mailError(){
    // setCorreoError(false);
    setCorreoCortoError(false);
    setCorreoLargoError(false);
  }
  function empError(){
    setEmpresaVaciaError(false);
    setEmpresaLargaError(false);
  }
  function passwError(){
    setContrasenaError(false);
    setContrasenaLargaError(false);
  }

  useEffect(() => {
  
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = pos.coords;
      
      fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${coords.latitude}&lon=${coords.longitude}&apiKey=caa86e9cf3884c1fbb995c1d55c56872`, {
        method: 'GET'
      })
        .then(respuesta => respuesta.json())
        .then(resultado => {
          let indexDepartamento = -1;
          for(let i = 0; i < Colombia.length; i++){
            if(Colombia[i].departamento.toLowerCase() === resultado.features[0].properties.state.toLowerCase()){
              indexDepartamento = i;
              break;
            }
          }
  
          let indexMunicipio = -1;
  
          if(indexDepartamento != -1){
            for(let i = 0; i < Colombia[indexDepartamento].ciudades.length; i++){
              if(Colombia[indexDepartamento].ciudades[i].toLowerCase() === resultado.features[0].properties.county.toLowerCase()){
                indexMunicipio = i;
                break;
              }
            }
          }
  
          setDepIndex(indexDepartamento);
          setMunIndex(indexMunicipio);

          setValues(prevState => ({
            ...prevState,
            departamento: Colombia[indexDepartamento].departamento,
            municipio: Colombia[indexDepartamento].ciudades[indexMunicipio]
          }));

  
        })
        .catch(error => {});
    })
  }, []);



  function depError() {
    setDepartamentoError(false)
  }
  function munError() {
    setMunicipioError(false)
  }

  function handleChangeDepartamento(e) {
    const index = e.target.value;
    setDepIndex(index);
    const departamentoSeleccionado = index > -1 ? Colombia[index].departamento : "";
    setMunIndex(-1);
    setValues(prevState => ({
      ...prevState,
      departamento: departamentoSeleccionado,
      municipio: ""
    }));
  }

  function handleChangeMunicipio(e) {
    const index = e.target.value;
    setMunIndex(index)
    const municipioSeleccionado = index > -1 ? Colombia[depIndex].ciudades[index] : "";
    setValues(prevState => ({
      ...prevState,
      municipio: municipioSeleccionado
    }));
  }
  
 

  const handleTerminosChange = (e) =>{
    setTerminosCondiciones(e.target.checked);
    setCheckboxError(false);
  }
  
  const handlePoliticaChange = (e) =>{
    setPoliticaPrivacidad(e.target.checked);
    setCheckboxError(false);
  }

  const [values, setValues] = useState({
    nombreCompleto: "",
    cedula: "",
    numero: "",
    correo: "",
    contrasena: "",
    departamento: "",
    municipio: "",
    direccion: "",
    empresa: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/
    // let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

    let hasErrors = false;

    // Validaciones
    if (values.nombreCompleto.length < 3) {
      setNombreCortoError(true);
      hasErrors = true;
    }
    else if(values.nombreCompleto.length > 100){
      setNombreLargoError(true);
      hasErrors = true;
    }
    else {
      setNombreCortoError(false);
      setNombreLargoError(false);
    }
  
    if (values.cedula.length < 5 || values.cedula.length > 10) {
      setCedulaError(true);
      hasErrors = true;
    }
    else if(Math.sign(values.cedula) == -1){
      setCedulaNegativaError(true);
      hasErrors = true;
    }
    else {
      setCedulaError(false);
    }
  
    if (values.numero.length !== 10) {
      setNumeroError(true);
      hasErrors = true;
    } else {
      setNumeroError(false);
    }
  
    if (!values.correo) {
      setCorreoCortoError(true);
      hasErrors = true;
    }
    else if(values.correo.length > 100){
      setCorreoLargoError(true);
      hasErrors = true;
    }
    // else if (!validEmail.test(values.correo)) {
    //   setCorreoError(true);
    //   hasErrors = true;
    // }
    else {
      // setCorreoError(false);
      setCorreoCortoError(false);
      setCorreoLargoError(false);
    }
  
    if (!validPassword.test(values.contrasena)) {
      setContrasenaError(true);
      hasErrors = true;
    }
    else if(values.contrasena.length > 60){
      setContrasenaLargaError(true);
      hasErrors = true;
    }
    else {
      setContrasenaError(false);
      setContrasenaLargaError(false);
    }
  
    if (values.direccion.length < 5) {
      setDireccionCortaError(true);
      hasErrors = true;
    }
    else if(values.direccion.length > 200){
      setDireccionLargaError(true);
      hasErrors = true;
    }
    else {
      setDireccionCortaError(false);
      setDireccionLargaError(false);
    }
  
    if (depIndex == -1) {
      setDepartamentoError(true);
      hasErrors = true;
    } else {
      setDepartamentoError(false);
    }
  
    if (munIndex == -1) {
      setMunicipioError(true);
      hasErrors = true;
    } else {
      setMunicipioError(false);
    }
  
    if (!values.empresa) {
      setEmpresaVaciaError(true);
      hasErrors = true;
    }
    else if(values.empresa.length > 100){
      setEmpresaLargaError(true);
      hasErrors = true;
    }
    else {
      setEmpresaVaciaError(false);
      setEmpresaLargaError(false);
    }
    
    if(!terminosCondiciones){
      setCheckboxError(true);
      hasErrors = true;
    }

    if(!politicaPrivacidad){
      setCheckboxError(true);
      hasErrors = true;
    }

    // if (!terminosCondiciones || !politicaPrivacidad) {
    //   setCheckboxError(true);
    //   hasErrors = true;
    // } else {
    //   setCheckboxError(false);
    // }
        
  
    // Si hay errores, no continuar con el envío
    if (hasErrors) {
      return;
    }
 try {
  
  const regis=   await   fetch("http://54.87.25.132/users", {
      method: "POST",

      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
      },
      body: JSON.stringify(values),
    })
    console.log("ir revisando esto que no me joda si falla correo",values)
    const data = await regis.json();
   
    if(regis.ok){

      Swal.fire({
        title: '¡Éxito!',
        text: 'Se ha registrado correctamente.',
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
    navigate('/login');
   }
   else{
    Swal.fire({
      title: '¡Error!',
      text: 'Ha fallado el registro del usuario.',
      icon: 'error',// esto da el color que esta alrededor de icono
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
   }
   
  
 
  }catch(error){
    Swal.fire('Error', 'No fue posible el proceso de registro por un error', 'error');
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

  return (
    <>
    <Navbar/>
    <div className={style.signUpProductor}>
      <h2>
        Bienvenid@, <br /> Registrate ahora
      </h2>
      <form action="" onSubmit={handleSubmit} ref={form}>
        <div>
          <div className={style.box}>
            <PersonIcon sx={{ fontSize: 20 }} className={style.icon} />
            <input
              type="text"
              placeholder="Nombre Completo"
              name="nombreCompleto"
              id="nombreCompleto"
              autoComplete="nombreCompleto"
              onChange={handleChange}
              onClick={nameError}
            />
       
          </div>
          {nombreCortoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15  }}>El nombre debe contener mínimo 3 caracteres</p> : ""}
          {nombreLargoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15  }}>El nombre no puede exceder 100 caracteres</p> : ""}
        </div>
        <div>
          <div className={style.box}>
            <CreditCardIcon sx={{ fontSize: 20 }} className={style.icon} />
            <input
              type="number"
              placeholder="Cedula"
              name="cedula"
              id="cedula"
              autoComplete="cedula"
              onChange={handleChange}
              onClick={cedError}
            />
          </div>
          {cedulaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>La cedula debe tener entre 5 a 10 caracteres</p>:""}
          {cedulaNegativaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>La cedula no puede ser un numero negativo</p>:""}
        </div>
        <div>
          <div className={style.box}>
            <LocalPhoneIcon sx={{ fontSize: 20 }} className={style.icon} />
            <input
              type="number"
              placeholder="Número"
              name="numero"
              id="numero"
              autoComplete="numero"
              onChange={handleChange}
             onClick={numError}
            />
          </div>
          {numeroError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>El teléfono debe ser de 10 números</p> : ""}
        </div>
        <div>
          <div className={style.box}>
            <EmailIcon sx={{ fontSize: 20 }} className={style.icon} />
            <input
              type="email"
              placeholder="Correo"
              name="correo"
              id="correo"
              autoComplete="correo"
              onChange={handleChange}
              onClick={mailError}
            />
          </div>
          {/* {correoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>El email debe tener la estructura de una dirección de correo electrónico. Verbigracia: alguien@gmail.com</p> : ""} */}
          {correoCortoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>Debe introducir una dirección de correo electrónico.</p> : ""}
          {correoLargoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>El email no puede exceder 100 caracteres</p> : ""}
        </div>
        <div>
          <div className={style.box}>
            <LockIcon sx={{ fontSize: 20 }} className={style.icon} />
            <input
             type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              name="contrasena"
              id="contrasena"
              autoComplete="contrasena"
              onChange={handleChange}
              onClick={passwError}
            />
            <span className="input-group-text" onClick={togglePasswordVisibility}>
            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </span>
          </div>
          {contrasenaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>La contraseña no cumple con los requisitos mínimos solicitados(Mínimo 8 caracteres de longitud. Almenos una letra mayúscula. Almenos una letra minúscula. Almenos un número. Almenos un caracter especial).</p> : ""}
          {contrasenaLargaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>La contraseña no puede exceder 60 caracteres</p> : ""}
        </div>
        <div>
          <div className={style.box}>
            <BusinessIcon sx={{ fontSize: 20 }} className={style.icon}/>
            <input
              type="text"
              placeholder="Nombre Empresa"
              name="empresa"
              id="empresa"
              autoComplete="empresa"
              onChange={handleChange}
              onClick={empError}
            />
          </div>
          {empresaVaciaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>Debe diligenciar este espacio</p> : ""}
          {empresaLargaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>La empresa no puede exceder 100 caracteres</p> : ""}
        </div>
        <div>
          <div className={style.box}>
            <MapIcon sx={{ fontSize: 20 }} className={style.icon} />
            <select
              value={depIndex}
              className="form-select"
              aria-label="Default select example"
              name="departamento"
              id="departamento"
              onChange={handleChangeDepartamento}
              onClick={depError}
            >
              <option value="-1">Departamento</option>
                        {Colombia.map((item, e) => (
                            <option key={e} value={e}>{item.departamento}</option>
                        ))}
            </select>
          </div>
          {departamentoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>Debe introducir una opción</p> : ""}
        </div>
        <div>
          <div className={style.box}>
            <MapIcon sx={{ fontSize: 20 }} className={style.icon} />
            <select
              value={munIndex}
              className="form-select"
              aria-label="Default select example"
              name="municipio"
              id="municipio"
              onChange={handleChangeMunicipio}
              onClick={munError}
            >
              <option value="-1" >Municipio</option>
                        {depIndex > -1 && Colombia[depIndex].ciudades.map((item, e) => (
                            <option key={e} value={e}>{item}</option>
                        ))}
            </select>
          </div>
          {municipioError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>Debe introducir una opción</p> : ""}
        </div>
        <div>
          <div className={style.box}>
            <HomeRoundedIcon sx={{ fontSize: 20 }} className={style.icon} />
            <input
              type="text"
              placeholder="Dirección"
              name="direccion"
              id="direccion"
              autoComplete="direccion"
              onChange={handleChange}
              onClick={dirError}
            />
          </div>
          {direccionCortaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15 }}>La dirección debe contener mínimo 5 caracteres</p> : ""}
          {direccionLargaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15 }}>La dirección no puede exceder 200 caracteres</p> : ""}
        </div>
        <div className={style.checkBox}>
          <input type="checkbox" onChange={handleTerminosChange}/>
          <label>
            He leído y acepto los{" "}
            <a href="">
              <strong>Términos y Condiciones.</strong>
            </a>
          </label>
          {checkboxError && !terminosCondiciones ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15 }}>Antes de registrarse lea los terminos y condiciones</p> : ""}
        </div>
        <div className={style.checkBox}>
          <input type="checkbox" onChange={handlePoliticaChange}/>
          <label>
            ¿Usted ha leído y acepta los términos y condiciones para el
            tratamiento de sus datos personales contenidos en la{" "}
            <a href="">
              <strong>Política de Privacidad Web</strong>
            </a>
            ?
          </label>
          {checkboxError && !politicaPrivacidad ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15 }}>Antes de registrarse lea la politica de privacidad</p> : ""}
        </div>
        <button type="submit" className={style.btnPrincipal}>
          Registrate aquí
        </button>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default SignUpProductor;