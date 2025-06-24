import Navbar from "../../general/navbar/Navbar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Footer from "../../general/footer/Footer";
import style from "./EditarComprador.module.css"
import estilo from '../../inicio/inicio.module.css';

import React, { useState, useEffect } from 'react';
import Colombia from '../../inicio/colombia';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../general/context/AuthContext';


function EditarComprador() {

  const { user, login, logout } = useAuth();
  const token = user?.token;
  const [comprador, setComprador] = useState();
  const navigate = useNavigate();

  const [depIndex, setDepIndex] = useState(-1);
  const [munIndex, setMunIndex] = useState(-1);

  const [departamentoError, setDepartamentoError] = useState(false);
  const [municipioError, setMunicipioError] = useState(false);
  const [nombreCortoError, setNombreCortoError] = useState(false);
  const [nombreLargoError, setNombreLargoError] = useState(false);
  const [cedulaError, setCedulaError] = useState(false);
  const [cedulaNegativaError, setCedulaNegativaError] = useState(false);
  const [numeroError, setNumeroError] = useState(false);
  const [correoError, setCorreoError] = useState(false);
  const [correoCortoError, setCorreoCortoError] = useState(false);
  const [correoLargoError, setCorreoLargoError] = useState(false);
  const [direccionCortaError, setDireccionCortaError] = useState(false);
  const [direccionLargaError, setDireccionLargaError] = useState(false);

  const [values, setValues] = useState({
    nombreCompleto: "",
    cedula: "",
    numero: "",
    correo: "",
    departamento: "",
    municipio: "",
    direccion: "",
  });

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
    setCorreoError(false);
    setCorreoCortoError(false);
    setCorreoLargoError(false);
  }

  function depError() {
    setDepartamentoError(false);
  }

  function munError() {
    setMunicipioError(false);
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
    if(decodedToken.role === "productor") navigate("/");

    compradorFetch();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };

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

  const compradorFetch = async () => {
    try {
      const response = await fetch(`http://54.87.25.132/compradores/0`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}` // Incluye el token aquí
        }
      });
      

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComprador(data);
      setValues({
        nombreCompleto: data.User.nombreCompleto,
        cedula: data.User.cedula,
        numero: data.User.numero,
        correo: data.User.correo,
        departamento: data.User.departamento,
        municipio: data.User.municipio,
        direccion: data.User.direccion,
      });

      organizarUbicacion(data.User.departamento, data.User.municipio);

      

    } catch (error) {
      console.error("Error fetching hives:", error);
    }
  };

  const organizarUbicacion = (departamento, municipio) => {
    let indexDepartamento = -1;
    for(let i = 0; i < Colombia.length; i++){
      if(Colombia[i].departamento.toLowerCase() === departamento.toLowerCase()){
        indexDepartamento = i;
        break;
      }
    }

    let indexMunicipio = -1;

    if(indexDepartamento != -1){
      for(let i = 0; i < Colombia[indexDepartamento].ciudades.length; i++){
        if(Colombia[indexDepartamento].ciudades[i].toLowerCase() === municipio.toLowerCase()){
          indexMunicipio = i;
          break;
        }
      }
    }

    setDepIndex(indexDepartamento);
    setMunIndex(indexMunicipio);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    let hasErrors = false;

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
    else if (!validEmail.test(values.correo)) {
      setCorreoError(true);
      hasErrors = true;
    } else {
      setCorreoError(false);
      setCorreoCortoError(false);
      setCorreoLargoError(false);
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

    if(hasErrors) return;
    
    try {
      const response = await fetch(`http://54.87.25.132/users/0`, {
        method: 'PUT',  // Usualmente, para actualizar datos se usa PUT
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)  // Envía los valores actualizados
      });
      if (response.status === 200) {

        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario modificado correctamente.',
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

        navigate('/MarketPlaceComp');
      } else {
        alert(`Error: ${response.status}`);
      }


    } catch (error) {
      console.error('Error al actualizar:', error);
    }

  };

  return (
    <div>
      <Navbar />
      <div className={style.cajaComprador}>
        {/*CONTENEDOR DE LA IZQUIERDA */}
        <div className={style.contenedorIzquierdaComprador}>
          <div>
            <div className={style.imagenComprador}>
              <AccountCircleIcon sx={{ fontSize: 250 }} />
            </div>
          </div>

          <div className={style.datosComprador}>

            <h2>Nombre Completo:</h2>
            <p>{comprador ? comprador.User.nombreCompleto : "Cargando..."}</p><br />

            <h2>Cedula:</h2>
            <p>Hay que Arreglar el archivo JSX</p><br />

            <h2>Correo:</h2>
            <p>{comprador ? comprador.User.correo : "Cargando..."}</p><br />


            <h2>Ubicacion:</h2>
            <p>Hay que Arreglar el archivo JSX</p><br />
           
            <h2>Dirección:</h2>
            <p>{comprador ? comprador.User.direccion : "Cargando..."}</p><br />

            <h2>Telefono:</h2>
            <p>{comprador ? comprador.User.numero : "Cargando..."}</p><br />
            
          </div>
        </div>

        {/*CONTENEDOR DE LA DERECHA */}
        <div className={style.contenedorDerechaComprador}>
          <h2 className={style.titul2Comprador}>Editar Datos del Perfil:</h2>
          <div className={style.imagenDosComprador}>
              <AccountCircleIcon sx={{ fontSize: 250 }} />
            </div>

          <form className={style.DatosaEditarComprador}>
            <div className={style.EditarDatosComprador}>
              <label htmlFor="">Nombre Completo:</label>
              <div className={estilo.box} style={{ margin: 0 }}>
                <input
                  type="text"
                  name="nombreCompleto"
                  id="name"
                  value={values.nombreCompleto}
                  placeholder="Nombre Completo"
                  onChange={handleChange}
                  onClick={nameError}
                />
              </div>
              {nombreCortoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15  }}>El nombre debe contener mínimo 3 caracteres</p> : ""}
              {nombreLargoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15  }}>El nombre no puede exceder 100 caracteres</p> : ""}
              <label htmlFor="">Cedula:</label>
              <div className={estilo.box} style={{ margin: 0 }}>
                <input disabled
                  type="number"
                  name="cedula"
                  id="cedula"
                  value={values.cedula}
                  onChange={handleChange}
                  onClick={cedError}
                />
              </div>
              {cedulaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>La cedula debe tener entre 5 a 10 caracteres</p>:""}
              {cedulaNegativaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>La cedula no puede ser un numero negativo</p>:""}
              <label htmlFor="">Teléfono:</label>
              <div className={estilo.box} style={{ margin: 0 }}>
                <input
                  type="text"
                  name="numero"
                  id="telefonoActual"
                  placeholder="+57"
                  value={values.numero}
                  onChange={handleChange}
                  onClick={numError}
                />
              </div>
              {numeroError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>El teléfono debe ser de 10 números</p> : ""}
              <label htmlFor="">Correo Electronico:</label>
              <div className={estilo.box} style={{ margin: 0 }}>
                <input disabled
                  type="email"
                  name="correo"
                  id="email"
                  value={values.correo}
                  placeholder="correo@gmail.com"
                  onChange={handleChange}
                  onClick={mailError}
                />
              </div>
              {correoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>El email debe tener la estructura de una dirección de correo electrónico. Verbigracia: alguien@gmail.com</p> : ""}
              {correoCortoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>Debe introducir una dirección de correo electrónico.</p> : ""}
              {correoLargoError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15   }}>El email no puede exceder 100 caracteres</p> : ""}
              <div>
                <label htmlFor="">Departamento:</label>
                <div className={estilo.box} style={{margin: 0}}>
                  {/* <MapIcon sx={{ fontSize: 20 }} className={estilo.icon} /> */}
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
                <label htmlFor="">Municipio:</label>
                <div className={estilo.box} style={{margin: 0}}>
                  {/* <MapIcon sx={{ fontSize: 20 }} className={estilo.icon} /> */}
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
              {/* <label htmlFor="">Departamento:</label>
              <div className={estilo.box} style={{ margin: 0 }}>
                <input
                  type="text"
                  name="departamento"
                  id="departamento"
                  value={values.departamento}
                  placeholder="Departamento"
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="">Municipio:</label>
              <div className={estilo.box} style={{ margin: 0 }}>
                <input
                  type="text"
                  name="municipio"
                  id="municipio"
                  value={values.municipio}
                  placeholder="municipio"
                  onChange={handleChange}
                />
              </div> */}
              <label htmlFor="">Dirección:</label>
              <div className={estilo.box} style={{ margin: 0 }}>
                <input
                  type="text"
                  name="direccion"
                  id="direccion"
                  value={values.direccion}
                  onChange={handleChange}
                  onClick={dirError}
                />
              </div>
              {direccionCortaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15 }}>La dirección debe contener mínimo 5 caracteres</p> : ""}
              {direccionLargaError ? <p style={{color:"red", fontSize:15, textAlign:"justify", marginLeft:15 }}>La dirección no puede exceder 200 caracteres</p> : ""}
            </div>

            
            <div className={style.btnsDatosPerfilComprador}>
              <button onClick={handleSubmit} type="submit" className={style.btnUpdateComprador}>
                Actualizar
              </button>
              <button className={style.btnCancelarComprador} type="button">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default EditarComprador;