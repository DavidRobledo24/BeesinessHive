import React from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../favoritos/FavoritesContext";
import styles from "./tarjetaMarketPlaceComp.module.css";
import iconFavorito from "../../../../assets/IconFavorito.png";
import iconoFavoritoRojo from "../../../../assets/iconoFavoritoRojo.png"; // Nuevo icono para favorito activo
import iconMensaje from "../../../../assets/IconMensaje.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../../general/context/AuthContext";

export default function TarjetaMarketPlaceComp({ articulo }) {
  const { user } = useAuth();
  const token = user?.token;

  const { favorites, addToFavorites } = useFavorites();
  const navigate = useNavigate();

  const isFavorite = favorites.some(
    (favorite) => favorite.idArticulo === articulo.idArticulo
  );

  const handleAddToFavorites = () => {
    addToFavorites(articulo);
  };

  const handleNavigateToChat = () => {
    navigate("/ChatByComprador", {
      state: {
        idProductor: articulo.idProductor,
      },
    });
  };

  return (
    <div className={styles.contenedorGeneral}>
      <Link to={`/Producto/${articulo.idArticulo}`} className={styles.contImage}>
        <figure>
          <img src={articulo.imagen} className={styles.imgItem} alt="Producto" />
          <div className={styles.capa}>
            <h3>Ver más</h3>
          </div>
        </figure>
      </Link>
      <div className={styles.contInfo}>
        <h1 className={styles.nombreProducto}>{articulo.nombre}</h1>
        <p className={styles.descripcion}>{articulo.descripcion}</p>
        <p className={styles.vendedor}>{articulo.Productor.empresa}</p>
        <div className={styles.contValores}>
          <div className={styles.contValor}>
            <h1 className={styles.precio}>${articulo.precio}</h1>
          </div>
          <div className={styles.contDisponible}>
            <h2 className={styles.disponibles}>
              Disponibilidad: {articulo.cantidad} <br /> Unidades
            </h2>
          </div>
        </div>
      </div>
      <div className={styles.contBotones}>
        <button
          className={`${styles.btnTarjeta} ${isFavorite ? styles.favorito : ""}`}
          onClick={handleAddToFavorites}
        >
          <img 
            src={isFavorite ? iconoFavoritoRojo : iconFavorito} 
            alt="Favorito" 
          />
        </button>
        <button className={styles.btnTarjeta} onClick={handleNavigateToChat}>
          <img src={iconMensaje} alt="Mensaje" />
        </button>
      </div>
    </div>
  );
}
