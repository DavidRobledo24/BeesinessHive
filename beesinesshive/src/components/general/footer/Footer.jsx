import React from 'react';
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useAuth } from '../../general/context/AuthContext';
import './footer.css';

const Footer = () => {
    const { user } = useAuth();

    return (
        <footer>
            {user ? "" : 
            <div className="sitios">
                <h2>Sitios</h2>
                <ul>
                <li><HashLink smooth to="/#queEs">¿Qué es?</HashLink>  {/* Reemplazar <a> por <Link> */}</li>
                <li><HashLink smooth to="/#teamWork">Grupo de trabajo</HashLink>  {/* Reemplazar <a> por <Link> */}</li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/rol">Registro</Link></li>
                </ul>
            </div>}
            
            <div className="Contacto">
                <h2>Contacto</h2>
                <ul>
                    <li><a href="https://github.com/Minajio" target='_blank'>Andrés Osorio</a></li>
                    <li><a href="https://github.com/DavidRobledo24" target='_blank'>David Alejandro Robledo</a></li>
                    <li><a href="https://github.com/Mimi0908" target='_blank'>Emily García</a></li>
                    <li><a href="https://github.com/NaranjoMorales" target='_blank'>Fabio Andrés Naranjo</a></li>
                    <li><a href="https://github.com/Jordy-int" target='_blank'>Jordy Sneider Arias</a></li>
                    <li><a href="https://github.com/Valentina0630" target='_blank'>Valentina González</a></li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;
