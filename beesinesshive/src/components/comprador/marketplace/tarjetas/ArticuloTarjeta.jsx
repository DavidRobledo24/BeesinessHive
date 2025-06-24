import React, { useState, useEffect } from 'react';
import TarjetaMarketPlaceComp from './TarjetaMarketPlaceComp';
import styles from './tarjetaMarketPlaceComp.module.css';
import { useAuth } from '../../../general/context/AuthContext';
import BarraDeBusqueda from '../barraBusqueda/BarraDeBusqueda';

export default function ArticuloMarketPlaceComp({ categoria }) {
  const [articulos, setArticulos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); 
  const { user, login, logout } = useAuth();
  const token = user?.token;

  const fetchArticulos = async () => {
    setIsLoading(true); 
    try {
      const response = await fetch('http://54.87.25.132/articulos', {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}` 
        }
      });
      const data = await response.json();
      setArticulos(data);

    } catch (error) {
      setError(error);
      console.error('Error fetching articulos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticulos();
  }, []);

  const productosFiltrados = articulos.filter((articulo) => {
    const matchesCategoria = categoria ? articulo.categoria === categoria : true;
    const matchesBusqueda = articulo.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategoria && matchesBusqueda;
  });


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <div className={styles.barraBusquedaContenedor}>
        <BarraDeBusqueda 
          searchTerm={searchTerm} 
          onSearchChange={handleSearchChange} 
        />
      </div>
      {isLoading ? (
        <p>Cargando artículos...</p>
      ) : error ? (
        <p>Error al cargar los artículos: {error.message}</p>
      ) : (
        <div className={styles.listaArticulos}>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((articulo) => (
              <TarjetaMarketPlaceComp 
                key={articulo.idArticulo} 
                articulo={articulo} 
                idProductor={articulo.idProductor}
              />
            ))
          ) : (
            <p>No se encontraron artículos para tu búsqueda.</p>
          )}
        </div>
      )}
    </>
  );
}
