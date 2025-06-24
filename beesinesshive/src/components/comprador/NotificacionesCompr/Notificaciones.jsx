import React, { useRef } from 'react';
//import styles from './categoriasComprador.module.css';


const Notificaciones = () => {
    return (
      <div>
        
        <div className="caja">
          {/*CONTENEDOR DE LA IZQUIERDA */}
          <div className="contenedorIzquierda">
            <div>
              <div className="imagen">
                <AccountCircleIcon sx={{ fontSize: 300 }} />
              </div>
              <a className="EditarFoto" href="">Editar Foto del Perfil</a>
            </div>
  
            <div className="datos">
              <h2>Nombre Completo:</h2>
              <p>David Vilcao</p>
             
              <h2>Correo Electrónico:</h2>
              <p>davidvilcao@gmail.com</p>
  
              <h2>Dirección:</h2>
              <p>Calle #123, Colonia, CP 12345</p>
              
              <h2>Telefono:</h2>
              <p>+57 3237689054</p>
            </div>
          </div>
  
          {/*CONTENEDOR DE LA DERECHA */}
          <div className="contenedorDerecha">
            <h2 className="titul">Editar Datos del Perfil:</h2>
  
            <form className="DatosaEditar">
              <div className="EditarDatos">
                <label htmlFor="">Nombre Completo:</label>
                <div className="box">
                  <input
                    type="text"
                    name="nombre"
                    id="name"
                    placeholder="Nombre"
                  ></input>
                </div>
                <label htmlFor="">Correo Electronico:</label>
                <div className="box">
                  <input
                    type="email"
                    name="correo"
                    id="email"
                    placeholder="Correo@gmail.com"
                  ></input>
                </div>
                <label htmlFor="">Contraseña Actual:</label>
                <div className="box">
                  <input
                    type="password"
                    name="contraseñaActual"
                    id="contraseñaActual"
                    placeholder="P3pit0P3r3z!."
                  ></input>
                </div>
                <label htmlFor="">Contraseña Nueva:</label>
                <div className="box">
                  <input
                    type="password"
                    name="contraseñaNueva"
                    id="contraseñaNueva"
                    placeholder="P3pit0P3r3z!."
                  ></input>
                </div>
                <label htmlFor="">Repetir Contraseña:</label>
                <div className="box">
                  <input
                    type="password"
                    name="contraseñaRepetida"
                    id="contraseñaRepetida"
                    placeholder="P3pit0P3r3z!."
                  ></input>
                </div>
                <label htmlFor="">Dirección:</label>
                <div className="box">
                  <input
                    type="text"
                    name="direccionActual"
                    id="direccionActual"
                  ></input>
                </div>
                <label htmlFor="">Dirección Nueva:</label>
                <div className="box">
                  <input
                    type="text"
                    name="direccionNueva"
                    id="direccionNueva"
                  ></input>
                </div>
                <label htmlFor="">Teléfono:</label>
                <div className="box">
                  <input
                    type="text"
                    name="telefonoActual"
                    id="telefonoActual"
                  ></input>
                </div>
                <label htmlFor="">Teléfono Nuevo:</label>
                <div className="box">
                  <input
                    type="text"
                    name="telefonoNuevo"
                    id="telefonoNuevo"
                  ></input>
                </div>
              </div>
              <div className="btnsDatosPerfil">
                <button type="button" className="btnUpdate">
                  Actualizar
                </button>
                <button className="btnCancelar" type="button">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default Notificaciones;
  