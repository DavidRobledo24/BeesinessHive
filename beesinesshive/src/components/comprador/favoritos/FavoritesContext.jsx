import React, { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [control, setControl] = useState(0);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
  
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);
  
  useEffect(() => {
  
    if(control === 1){
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    setControl(1);
  }, [favorites]);

  const addToFavorites = (item) => {
    const isFavorite = favorites.some((favorite) => favorite.idArticulo === item.idArticulo);

    if (isFavorite) {
      setFavorites((prev) => prev.filter((favorite) => favorite.idArticulo !== item.idArticulo));
      Swal.fire({
        title: '¡Eliminado!',
        text: 'Elemento eliminado de favoritos.',
        icon: 'info',
        iconHtml: '🗑️',
        background: 'linear-gradient(to right, #FFA500,  #FF7F50  )',
        color: '#fff', 
        confirmButtonText: 'Entendido',
        buttonsStyling: false,
        customClass: {
          popup: '',
          confirmButton: '', 
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
        },
      });
    } else {
      setFavorites((prev) => [...prev, item]);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Elemento agregado a favoritos.',
        icon: 'success',
        iconHtml: '❤️',
        background: 'linear-gradient(to right, #FFA500,  #FF7F50  )',
        color: '#fff', 
        confirmButtonText: 'Entendido',
        buttonsStyling: false,
        customClass: {
          popup: '',
          confirmButton: '', 
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
        },
      });
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
