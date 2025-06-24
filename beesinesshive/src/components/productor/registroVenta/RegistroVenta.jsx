import React, { useState, useRef, useEffect } from "react";
import Navbar from '../../general/navbar/Navbar'
import Footer from '../../general/footer/Footer'
import style from '../../inicio/inicio.module.css'
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import InventoryIcon from '@mui/icons-material/Inventory';
import Style from './registroventa.module.css';

export default function RegistroVenta() {
  const [values, setValues]=useState({
    //datos de valores

  })
  const [productIndex, setProductIndex]=useState(-1);
  const [direcError, setDirecError]=useState(false);
  const [cantidadError, setCantidadError]=useState(false);
  const form = useRef();

  function direccionError(){
    setDirecError(false)
  }
  function cantError(){
    setCantidadError(false)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;

    // Validaciones de los campos
    if (hasErrors) {
      return;
    }


    await fetch("http://54.87.25.132/colmenas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.status === 201) {
          alert("Colmena creada con éxito");
          form.current.reset();
          window.location.hash = "/login";
        } else {
          alert(`Error: ${response.status}`);
        }
      })
      .catch((error) => {
        alert(`No fue posible crear la colmena debido a un error: ${error}`);
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

  function handleChangeProducto(e) {
    const index = e.target.value;
    setProductIndex(index);
    //terminar de modificar codigo

    // const departamentoSeleccionado = index > -1 ? Colombia[index].departamento : "";
    // setMunIndex(-1);
    // setValues(prevState => ({
    //   ...prevState,
    //   departamento: departamentoSeleccionado,
    //   municipio: ""
    // }));
  }
  return (
    <div>
      <Navbar/>
      <div className={Style.marginP}>
        <h2>Beesiness<span>Message:</span></h2>
        <form action="" onSubmit={handleSubmit} ref={form} className={Style.form}>
        <div className={Style.container}>
          <div className={style.box}>
            <input
              type="text"
              placeholder="Dirección de envío"
              name="adrees"
              id="adrees"
              onChange={handleChange}
              onClick={direccionError}
            />
          </div>
          <div className={style.box}>
            <InventoryIcon sx={{ fontSize: 20 }} className={style.icon} />
            <select
              value={productIndex}
              className="form-select"
              aria-label="Default select example"
              name="Producto"
              id="Producto"
              onChange={handleChangeProducto}
            >
              <option value="-1">Producto</option>
              {/* lista de los productos (GET) */}
            </select>
          </div>
          <div className={style.box}>
            <CalculateIcon sx={{ fontSize: 20 }} className={style.icon} />
            <input
              type="number"
              placeholder="Cantidad"
              name="cantidad"
              id="cantidad"
              autoComplete="cantidad"
              onChange={handleChange}
              onClick={cantError}
            />
          </div>
          <button type="button" className={Style.btn}>
            <AddIcon sx={{ fontSize: 50 }} className={style.icon}/>
          Añadir Producto
          </button>
          <h2 className={Style.total}>Total:</h2>
        </div>
        <button type="submit" className={Style.boton}>
          Generar
        </button>
        </form>
      </div>
      <Footer/>
    </div>
  )
}
