import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../general/navbar/Navbar";
import Footer from "../../general/footer/Footer";
import style from "../../inicio/inicio.module.css";
import BusinessIcon from "@mui/icons-material/Business";

export default function Empresa() {
    const [terminosCondiciones, setTerminosCondiciones] = useState(false);
    const [politicaPrivacidad, setPoliticaPrivacidad] = useState(false);
    const handleTerminosChange = (e) =>{
        setTerminosCondiciones(e.target.checked);
      }
    
      const handlePoliticaChange = (e) =>{
        setPoliticaPrivacidad(e.target.checked);
      }
  return (
    <div>
      <Navbar />
      <div className={style.restablecerContraseña}>
        <h2>Nombre de tu empresa</h2>
        <form action="">
          <div className={style.box}>
            <BusinessIcon sx={{ fontSize: 20 }} className={style.icon} />
            <input
              type="text"
              placeholder="Nombre Empresa"
              name="empresa"
              id="empresa"
              autoComplete="empresa"
            />
          </div>
          <br></br>
          <div className={style.checkBox}>
          <input type="checkbox" onChange={handleTerminosChange}/>
          <label>
            He leído y acepto los{" "}
            <a href="">
              <strong>Términos y Condiciones.</strong>
            </a>
          </label>
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
        </div>
          <button type="button" className={style.btnPrincipal}>
            Confirmar cambio
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
