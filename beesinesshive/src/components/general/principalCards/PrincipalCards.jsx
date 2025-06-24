import React from 'react';
import './principalCards.css'

const PrincipalCards = () => {
    return (
        <div className='section__cards'>
            <div className="card">
                <div className="cardImage" id='gestionColmena'></div>
                <div className="card-text">
                    <p>Gestión de Colmenas</p>
                </div>
            </div>
            <div className="card">
                <div className="cardImage" id='marketPlace'></div>
                <div className="card-text">
                    <p>MarketPlace</p>
                </div>
            </div>
        </div>
    );
}

export default PrincipalCards;
