import React from 'react'
import Navbar from '../../general/navbar/Navbar'
import Footer from '../../general/footer/Footer'
import QR from '../../../assets/qr.jpg'
import Styles from './qr.module.css'
import estilo from '../../inicio/inicio.module.css'

//falta la funcionalidad de los QR

export default function Qr() {
  return (
    <div>
      <Navbar/>
      <div className={Styles.container}>
      <a href="#" className={estilo.regreso}>Volver</a>
            <h2>QR Generado</h2>
            {/* simulacion de QR */}
            <div className={Styles.caja}>
              <img className={Styles.fotoTemporal}
              src={QR}
              alt="QR"></img>
              <button type="button" className={estilo.btnPrincipal+" "+Styles.btn}>Descargar</button>
              <button type="button" className={estilo.btnPrincipal+" "+Styles.btn}>Compartir</button>
            </div>
      </div>
      <Footer/>
    </div>
  )
}
