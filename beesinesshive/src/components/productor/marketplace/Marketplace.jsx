import React, { useState, useEffect } from 'react';
import marketplaceStyle from './marketplace.module.css';
import TarjetaProducto from './TarjetaProducto';
import Navbar from '../../general/navbar/Navbar';
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from "../../general/footer/Footer";

function Marketplace() {
    const { user, logout } = useAuth();
    const token = user?.token; 
    const [articulos, setArticulos] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
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
        if(decodedToken.role === "comprador") navigate("/");
        
        fetchMarketplaces();
    }, []);

    const fetchMarketplaces = async () => {
        try {
            const response = await fetch(`http://54.87.25.132/articulos/productor/0`, {
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
           
            setArticulos(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    const handleAddArticulo = () => {
        navigate('/CrearProducto');
    };

    // Filtrar los artículos basados en el término de búsqueda
    const filteredArticulos = articulos.filter((articulo) =>
        articulo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <div className={marketplaceStyle.contenedorBuscar}>
                <input
                    className={marketplaceStyle.buscar}
                    type="text"
                    placeholder="Buscar"
                    value={searchTerm} // Asociar el valor del input al estado
                    onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el estado cuando se escriba
                />
                <button
                    className={marketplaceStyle.cancelar}
                    onClick={() => setSearchTerm("")} // Limpiar la búsqueda al hacer clic en cancelar
                >
                    CANCELAR
                </button>
            </div>
            <h1 className={marketplaceStyle.tituloMarketplace}>MarketPlace</h1>
            
            <div className={marketplaceStyle.tarjetas}>
            {filteredArticulos.map((articulo, index) => (
                <TarjetaProducto 
                    key={index}
                    idArticulo={articulo.idArticulo}
                    cantidad={articulo.cantidad}
                    categoria={articulo.categoria}
                    nombre={articulo.nombre}
                    descripcion={articulo.descripcion}
                    tipo={articulo.categoria}
                    productor={articulo.idProductor}
                    lugar={articulo.Productor.empresa}
                    precio={articulo.precio}
                    imagen={articulo.imagen}
                    navigate={navigate}
                />
            ))}
            </div>

            <button
                className={marketplaceStyle.botonAgregar + " " + marketplaceStyle.botonAgregarMovil}
                onClick={handleAddArticulo}
            >
                +
            </button>
            <Footer />
        </>
    );
}

export default Marketplace;
