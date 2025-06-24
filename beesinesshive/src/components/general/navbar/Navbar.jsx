import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./navbar.css";
import StoreIcon from '@mui/icons-material/Store';
import abejaLogo from "../../../assets/abejaLogo.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TelegramIcon from '@mui/icons-material/Telegram';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Navbar() {
  const [role, setRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const token = user?.token;

  const [infoUsuario, setInfoUsuario] = useState({
    nombre: "",
    email: ""
  })

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleLogout = () => {
    logout(); // Llamamos a la función de logout que puede hacer limpieza en el contexto
  };

  const getRoleFromToken = (token) => {
    // Asume que el token está guardado en el localStorage
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodificamos el JWT (sin necesidad de librerías)
      return decodedToken.role;
    }
    return null;
  };
// hacer un fetch para rescatar los datos para el perfil, ahi ya hay medio trabajo ehco con el role que renderiza condicional
  useEffect(() => {
    if (token) {
      const role = getRoleFromToken(token); // Obtener el rol del token
      setRole(role); // Establecer el rol en el estado
      // Se consigue la información del usuario correspondiente
      if(role === 'productor') productorFetch();
      if(role === 'comprador') compradorFetch();
    }
  }, [token]); // Este useEffect solo se ejecutará cuando `token` cambie

  const productorFetch = async () => {
    try {
        const response = await fetch(`http://54.87.25.132/producers/0`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        });
      
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setInfoUsuario({
          nombre: data.User.nombreCompleto,
          email: data.User.correo
        });

    } catch (error) {
        console.error("Error:", error);
    }
};

const compradorFetch = async () => {
  try {
    const response = await fetch(`http://54.87.25.132/compradores/0`, {
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}` // Incluye el token aquí
      }
    });
    

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    setInfoUsuario({
      nombre: data.User.nombreCompleto,
      email: data.User.correo
    });

  } catch (error) {
    console.error("Error fetching hives:", error);
  }
};

  return (
    <header className="navbar">
      <Link to='/'>
        <div className="titulo">
          <h1>
            <span className="beesiness">Beesiness</span>
            <span className="hive">Hive</span>
            <img src={abejaLogo} alt="Logo" />
          </h1>
        </div>
      </Link>
      <button className="menu-toggle" onClick={toggleSidebar}>
        &#9776;
      </button>
      <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          &times;
        </button>
        <ul className="links">

          {/* Mostrar el enlace "Login" o "Logout" según el estado de autenticación */}
          {user ? (
            <>


              {role === 'productor' && (
                <>
                  <li className="content-perfil">
                    <Link to='/EditarApicultor' className="perfil"> <AccountCircleIcon className="link" /></Link>
                    <p className="name">{infoUsuario.nombre}</p>
                    <p className="gmail">{infoUsuario.email}</p>
                  </li>
                  <li>
                    <Link to='/gestionApiarios' className="link"><WarehouseIcon className="icono" /> Gestion de Apiarios</Link> {/* Enlace de perfil del usuario */}
                  </li>
                  <li>
                    <Link to='/MarketplaceProd' className="link"><ShoppingCartIcon className="icono" /> MarketPlace</Link> {/* Enlace de perfil del usuario */}
                  </li>
                  <li>
                    <Link to='/NotificacionesChat' className="link"><TelegramIcon className="icono" /> BeesinessMessage</Link> {/* Enlace de perfil del usuario */}
                  </li>
                  <li>
                    <Link to="/Facturas" className="link"><ReceiptLongIcon className="icono" /> Pedidos</Link> {/* Enlace de perfil del usuario */}
                  </li>
                  <li>
                    <Link to="/Notificaciones" className="notifi"> <NotificationsIcon className="icono" /> <span className="texto">Notificaciones</span></Link> {/* Enlace de perfil del usuario */}
                  
                  </li>
                  <li className="dropdown">
                    <Link to='/EditarApicultor' className="perfil"> <AccountCircleIcon className="" sx={{color:'black'}} /></Link> {/* Enlace de perfil del usuario */}
                    <div className="dropdown-content">
                      <h2>Perfil:</h2>
                      <p>{infoUsuario.nombre}
                        <br />{infoUsuario.email}</p>
                      <Link to="/EditarApicultor" className="opciones">Opciones Avanzadas</Link>
                      <Link to='/' onClick={handleLogout} className="logout-button">
                        Cerrar sesión <ExitToAppIcon />
                      </Link>
                    </div>
                  </li>
                  <li className="logout">
                    <Link to='/' onClick={handleLogout} className="logout-button">
                      Cerrar sesión <ExitToAppIcon />
                    </Link>
                  </li>
                </>
              )}
              {role === 'comprador' && (
                <>
                  <li className="content-perfil">
                    <Link to='/EditarComprador' className="perfil"> <AccountCircleIcon  className="link" /></Link>
                    <p className="name">{infoUsuario.nombre}</p>
                    <p className="gmail">{infoUsuario.email}</p>
                  </li>
                  <li>
                    <Link to='/MarketplaceComp' className="link"><StoreIcon className="icono"/>Tienda</Link>
                  </li>
                  <li>
                    <Link to='/NotificacionesChatComprador' className="link"><TelegramIcon className="icono" />BeesinessMessage</Link>
                  </li>
                  <li>
                    <Link to='/Favoritos' className="link"><FavoriteIcon className="icono"/>Favoritos</Link>
                  </li>
                  <li>
                    <Link to='/Notificaciones' className="notifi"><NotificationsIcon className="icono" /> <span className="texto">Notificaciones</span></Link>
           
                  </li>
                  <li className="dropdown">
                    <Link to='/EditarComprador' className="perfil"> <AccountCircleIcon className="" sx={{color:'black'}} /></Link> {/* Enlace de perfil del usuario */}
                    <div className="dropdown-content">
                      <h2>Perfil:</h2>
                      <p>{infoUsuario.nombre}
                        <br />{infoUsuario.email}</p>
                      <Link to="/EditarComprador" className="opciones">Opciones Avanzadas</Link>
                      <Link to='/' onClick={handleLogout} className="logout-button">
                        Cerrar sesión <ExitToAppIcon />
                      </Link>
                    </div>
                  </li>
                  <li className="logout">
                    <Link to='/' onClick={handleLogout} className="logout-button">
                      Cerrar sesión <ExitToAppIcon />
                    </Link>
                  </li>
                </>
              )}
            </>
          ) : (
           
            <>
            <li>
              <HashLink smooth to="/#queEs" className="link">¿Qué es?</HashLink>  {/* Reemplazar <a> por <Link> */}
            </li>
            <li>
              <HashLink smooth to="/#teamWork" className="link">Grupo de trabajo</HashLink>  {/* Reemplazar <a> por <Link> */}
            </li>
            <li>
              <Link to="/login" className="link">Login</Link>
            </li>
            <li>
              <Link to="/rol" className="link">Registro</Link>
            </li>
          </>
          
          )}
        </ul>
      </nav>
      <div
        className={`overlay ${isSidebarOpen ? "open" : ""}`}
        onClick={toggleSidebar}
      ></div>
    </header>
  );
}



