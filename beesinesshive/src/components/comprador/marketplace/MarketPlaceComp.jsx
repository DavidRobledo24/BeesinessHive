import React, { useState, useEffect } from 'react';
import Navbar from '../../general/navbar/Navbar'
import Footer from '../../general/footer/Footer'
import CategoriasComprador from '../marketplace/categorias/CategoriasComprador'
import ArticuloMarketPlaceComp from './tarjetas/ArticuloTarjeta'
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MarketPlaceComp() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const { user, logout } = useAuth();
  const token = user?.token; 
  const navigate = useNavigate();

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
  }, []);

  return (
    <>
        <Navbar />

        <CategoriasComprador setCategoriaSeleccionada={setCategoriaSeleccionada} />  
        <ArticuloMarketPlaceComp categoria={categoriaSeleccionada} />
        
        <Footer />
    </>
  )
}
