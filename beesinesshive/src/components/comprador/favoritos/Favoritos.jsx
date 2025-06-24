import React, { useEffect } from 'react';
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../general/navbar/Navbar';
import Footer from '../../general/footer/Footer';
import TarjetaMarketPlaceComp from '../marketplace/tarjetas/TarjetaMarketPlaceComp';
import { useFavorites } from './FavoritesContext';
import style from './favoritos.module.css';

export default function Favoritos() {
  const { favorites } = useFavorites();
  const { user, login, logout } = useAuth();
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

  const handleBackToMarketplace = () => {
    navigate('/MarketPlaceComp');
  };

  return (
    <div>
      <Navbar />
      <div className={style.container}>
        <h2>Favoritos:</h2>
        <button
          className={style.backButton} 
          onClick={handleBackToMarketplace}
        >
          Volver al Marketplace
        </button>
        <div className={style.listaFavoritos}>
          {favorites.length > 0 ? (
            favorites.map((articulo) => (
              <TarjetaMarketPlaceComp key={articulo.idArticulo} articulo={articulo} />
            ))
          ) : (
            <p>No tienes artículos en favoritos.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
