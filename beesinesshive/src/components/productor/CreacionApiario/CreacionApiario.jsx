import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../../general/navbar/Navbar";
import Colombia from "../../inicio/colombia";
import MapIcon from '@mui/icons-material/Map';
import style from "./CreacionApiario.module.css";
import Footer from "../../general/footer/Footer";
import estilo from '../../inicio/inicio.module.css';
import Icon from '@mdi/react';
import { mdiBeehiveOutline } from '@mdi/js'; //npm install @mdi/react @mdi/js
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../general/context/AuthContext';


const CreacionApiario = () => {

  const [depIndex, setDepIndex] = useState(-1);
  const [munIndex, setMunIndex] = useState(-1);
  const [errors, setError] = useState(false);
  
  const [departamentoError, setDepartamentoError] = useState(false);
  const [municipioError, setMunicipioError] = useState(false);
  const [coordenadas, setCordenadas]=useState("");
  
  const [nombreError, setNombreError]=useState(false);
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const token = user?.token; 
  const form = useRef();

  function nomError(){
    setNombreError(false);
  }

  function depError(){
    setDepartamentoError(false);
  }

  function munError(){
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
    if(decodedToken.role === "comprador") navigate("/");
  }, []);

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
          setCordenadas(`latitud: ${coords.latitude} longitud:${coords.longitude} `);
          setValues(prevValues => ({
            ...prevValues,
            departamento: Colombia[indexDepartamento].departamento,
            municipio: Colombia[indexDepartamento].ciudades[indexMunicipio]
            // departamento: indexDepartamento !== -1 ? Colombia[indexDepartamento].departamento : "",
            // municipio: indexMunicipio !== -1 ? Colombia[indexDepartamento].ciudades[indexMunicipio] : ""
          }));
  
        
        })
        .catch(error => console.log('error', error));
    })
    
  }, []);


 

  // function handleChangeDepartamento(e) {
  //   const index = e.target.value;
  //   setDepIndex(index);

  //   const departamentoSeleccionado = index > -1 ? Colombia[index].departamento : "";
  
  //   // Actualiza el estado de values con el departamento seleccionado
  //   setValues(prevValues => ({
  //     ...prevValues,
  //     departamento: index > -1 ? Colombia[index].departamento : ""
  //   }));
  // }

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
 
  // function handleChangeMunicipio(e) {
  //   const index = e.target.value;
  //   setMunIndex(index);
  //   const municipioSeleccionado = index > -1 ? Colombia[depIndex].ciudades[index] : "";
  
  //   // Actualiza el estado de values con el municipio seleccionado
  //   setValues(prevValues => ({
  //     ...prevValues,
  //     municipio: index > -1 ? Colombia[depIndex].ciudades[index] : ""
  //   }));
  // }

  function handleChangeMunicipio(e) {
    const index = e.target.value;
    setMunIndex(index)
    const municipioSeleccionado = index > -1 ? Colombia[depIndex].ciudades[index] : "";
    setValues(prevState => ({
      ...prevState,
      municipio: municipioSeleccionado
    }));
  }

  const [values, setValues] = useState({
    nombre: "",
    departamento: "",
    municipio: "",
    coordenadas
    
  });





    
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;

   

    // Validaciones
    if (values.nombre.length < 3) {
      setNombreError(true);
      hasErrors = true;
    } else {
      setNombreError(false);
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
    
    /*
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }
      */
    // Si hay errores, no continuar con el envío
    if (hasErrors) {
      return;
    }
    const dataToSubmit = {
      ...values,
      coordenadas: coordenadas
      
  };
  

  
    await fetch("http://54.87.25.132/apiarios", {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}` // Incluye el token aquí
      },
      body: JSON.stringify(dataToSubmit),
    })
      .then((response) => {
        if (response.status === 200) {


    Swal.fire({
      title: '¡Éxito!',
      text: 'Se ha creado el apiario correctamente.',
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
          navigate('/gestionApiarios');
      
        }
        if (response.status === 400) {
          Swal.fire('Error', 'Ha fallado la creación del apiario', 'error');
         
        }
      })
      .catch((error) => {
        Swal.fire('Error', 'Ha fallado la creación del apiario', 'error');
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
  
 

  return (
    <div>
      <Navbar/>
      <div className={style.datosCentrados}>
      <h2 
      className={style.tituloApiario}>Crear Apiario:
      </h2>
        <form className={style.DatosaAgregar} action="" onSubmit={handleSubmit} ref={form}>
          <div className={style.DatosAgregar}>

            <div className={estilo.box}>
            <Icon className={estilo.icon} path={mdiBeehiveOutline} size={1} />
              <input
                type="text"
                placeholder="Nombre del Apiario"
                name="nombre"
                id="name"
                autoComplete="nombreApiarioCompleto"
                onChange={handleChange}
                onClick={nomError}
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
              El nombre del Apiario debe contener mínimo 3 caracteres
            </p>
          ) : (
            ""
          )}
        </div>
        <div className={estilo.box}>
            <MapIcon sx={{fontSize:20}} className={estilo.icon}/>
              <select 
              value={depIndex} 
              className="form-select" 
              aria-label="Default select example" 
              name='departamento' id='departamento' 
              onChange={handleChangeDepartamento}
              onClick={depError}
              >
               <option value="-1">Departamento</option>
                      {Colombia.map((item, e) => (
                          <option key={e} value={e}>{item.departamento}</option>
                        ))}
              </select>
          </div>
          {departamentoError ? (
            <p
              style={{
                color: "red",
                fontSize: 15,
                textAlign: "justify",
                marginLeft: 15,
              }}
            >
              Debe introducir una opción
            </p>
          ) : (
            ""
          )}
              
        <div>
          <div className={estilo.box}>
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
          {municipioError ? (
            <p
              style={{
                color: "red",
                fontSize: 15,
                textAlign: "justify",
                marginLeft: 15,
              }}
            >
              Debe introducir una opción
            </p>
          ) : (
            ""
          )}
        </div>

            {/* <div className={style.Ubicacion} style={{ margin: '20px 0' }}>
              <iframe className={style.Mapa}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1987.8716123014774!2d-75.7016060339188!3d4.814093326382728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38874fecb5c80d%3A0xe2ea252ec17f3dd7!2sSENA%20-%20Centro%20Agropecuario%20y%20de%20Comercio%20y%20Servicios.!5e0!3m2!1ses!2sco!4v1726977188008!5m2!1ses!2sco"   
  
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div> */}

            <div className={style.btnsDatosPerfil}>
              <button type="submit" className={style.btnCrear}>
                Crear
              </button>
            </div>
            </form>
          </div>
      <Footer />
    </div >
  );
};


export default CreacionApiario;
/*


*/