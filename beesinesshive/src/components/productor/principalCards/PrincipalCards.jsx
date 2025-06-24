import React, { useEffect } from 'react';
import './principalCards.css'
import { Link } from 'react-router-dom';
import { useAuth } from '../../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../general/navbar/Navbar";
import Footer from "../../general/footer/Footer";
const PrincipalCards = () => {
    const { user, logout } = useAuth();
    const token = user?.token;
    const navigate = useNavigate();

    useEffect(() =>{
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
    }, []);
    
    return (
      <div>
        <Navbar/>
        <div className='section__cards'>
            <Link  to='/gestionApiarios' style={{ textDecoration: 'none' }} className="card">
                    <div className="cardImage" id='gestionColmena'></div>
                        <div className="card-text">
                        <p> Gestión de Apiarios </p>
                    </div>
            </Link> 
            <Link  to='/MarketplaceProd' style={{ textDecoration: 'none' }} className="card">
                <div className="cardImage" id='marketPlace'></div>
                    <div className="card-text">
                        <p>MarketPlace</p>
                    </div>
            </Link>
        </div>
        <Footer/>
        </div>  
    );
}
 
export default PrincipalCards;
