import React, { useEffect } from 'react';
import { useAuth } from '../general/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../general/navbar/Navbar';
import Body from '../general/body/Body';
import Footer from '../general/footer/Footer';

function Inicio(){

    const { user, login, logout } = useAuth();
    const token = user?.token;
    const navigate = useNavigate();

    useEffect(() => {
        if(token){
            fetch(`http://54.87.25.132/articulos`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'authorization': `Bearer ${token}`
                }
              }).then(response => {
                    if(response.status == 403){
                        logout();
                    }
                    else{
                        const decodedToken = JSON.parse(atob(token.split('.')[1]));
                        if(decodedToken.role === "productor") navigate("/principalCards");
                        else if(decodedToken.role === "comprador") navigate("/MarketPlaceComp");
                    }
              })
        }
    }, []);

    return(
        <>
            <Navbar />
            <Body />
            <Footer/>
        </>
    )
}

export default Inicio;