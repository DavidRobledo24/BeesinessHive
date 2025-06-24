import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../../general/navbar/Navbar";
import Colombia from "../../inicio/colombia";
import MapIcon from '@mui/icons-material/Map';
import style from "../CreacionApiario/CreacionApiario.module.css";
import Footer from "../../general/footer/Footer";
import estilo from '../../inicio/inicio.module.css';
import Icon from '@mdi/react';
import { mdiBeehiveOutline } from '@mdi/js'; //npm install @mdi/react @mdi/js
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../general/context/AuthContext';
import { useLocation } from 'react-router-dom';


const EditarApiario = () => {

  const [depIndex, setDepIndex] = useState(-1);
  const [munIndex, setMunIndex] = useState(-1);
  const [errors, setError] = useState(false);
  
  const [departamentoError, setDepartamentoError] = useState(false);
  const [municipioError, setMunicipioError] = useState(false);
  const [nombreError, setNombreError]=useState(false);

  
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const token = user?.token; 
  const location = useLocation(); // Obtén el estado desde la ubicación actual
  const { idApiario } = location.state || {}; 


  const form = useRef();

  const [values, setValues] = useState({
 
    nombre:"",
    departamento:"",
    municipio:"",
    
    idProductor:0
    

  });
  const [Apiario, setApiario]=useState();

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
    apiarioFetch()
  }, []);


  const apiarioFetch = async () => {
    try {
        const response = await fetch(`http://54.87.25.132/apiarios/${idApiario}`, {
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
        setApiario(data);
        setValues({
        nombre:data.nombre,
        departamento:data.departamento,
        municipio:data.municipio,
        
        idProductor:data.idProductor
        });
        
     
        
    } catch (error) {
        console.error("Error fetching hives:", error);
    }
};

 

  function handleChangeDepartamento(e) {
    const index = e.target.value;
    setDepIndex(index);

    const departamentoSeleccionado = index > -1 ? Colombia[index].departamento : "";
  
    // Actualiza el estado de values con el departamento seleccionado
    setValues(prevValues => ({
      ...prevValues,
      departamento: index > -1 ? Colombia[index].departamento : ""
    }));
  }

 
  function handleChangeMunicipio(e) {
    const index = e.target.value;
    setMunIndex(index);
    const municipioSeleccionado = index > -1 ? Colombia[depIndex].ciudades[index] : "";
  
    // Actualiza el estado de values con el municipio seleccionado
    setValues(prevValues => ({
      ...prevValues,
      municipio: index > -1 ? Colombia[depIndex].ciudades[index] : ""
    }));
  }
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;

    // Validaciones
    const newErrors = { nombre: "", departamento: "", municipio: "" };

    if (values.nombre.length < 3) {
        newErrors.nombre = "El nombre del Apiario debe contener mínimo 3 caracteres";
        hasErrors = true;
    }

    if (depIndex === -1) {
        newErrors.departamento = "Debe seleccionar un departamento";
        hasErrors = true;
    }

    if (munIndex === -1) {
        newErrors.municipio = "Debe seleccionar un municipio";
        hasErrors = true;
    }

    setError(newErrors); // Corrected here

    if (hasErrors) return;
    
    try {
      const response = await fetch(`http://54.87.25.132/apiarios/${idApiario}`, {
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
          text: 'Apiario modificado correctamente.',
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
         
          navigate('/gestionApiarios');
        } else {
          const errorData = await response.json();
          Swal.fire({
            title: "Error",
            text: errorData.message || "Error al modificar el apiario",
            icon: "error",
          });
        }
      
    
    } catch(error) {
      console.error('Error al actualizar:', error);
    
    }

      
  };
  
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el apiario y no se puede deshacer.',
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
        const response = await fetch(`http://54.87.25.132/apiarios/${idApiario}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          Swal.fire({
            title: '¡Eliminado!',
            text: 'El apiario ha sido eliminada.',
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
          navigate("/gestionApiarios");
        } else {
          const errorData = await response.json();
            Swal.fire({
            title: '¡Error!',
            text: 'Ocurrió un error al intentar eliminar el apiario.',
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
        console.error("Error al eliminar el apiario:", error);
          Swal.fire({
          title: '¡Error!',
          text: 'Ocurrió un error al intentar eliminar el apiario.',
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
      className={style.tituloApiario}>Editar Apiario:
      </h2>
        <form className={style.DatosaAgregar} action="" onSubmit={handleSubmit} ref={form}>
          <div className={style.DatosAgregar}>

            <div className={estilo.box}>
            <Icon className={estilo.icon} path={mdiBeehiveOutline} size={1} />
              <input
                type="text"
                placeholder="Nombre del Apiario"
                name="nombre"
                value={values.nombre}
                id="name"
                autoComplete="nombreApiarioCompleto"
                onChange={handleChange}
               
                
  
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
            <div className={style.btnsDatosPerfil}>
              <button type="submit" className={style.btnCrear}>
                Editar
              </button>
              <button type="button" className={style.btnEliminar} onClick={handleDelete}>
              Eliminar
            </button>
            </div>
            </form>
          </div>
      <Footer />
    </div >
  );
};


export default EditarApiario;

