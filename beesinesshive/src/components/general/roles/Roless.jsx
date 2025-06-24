import React from 'react';
import Farmer from '../../../assets/Farmer.png';
import Person from '../../../assets/Person.png';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import './roles.css'
import { Link } from "react-router-dom";

const Roless = () => {
    return (
        <div>
            <Navbar />
            <div className="section__rol">
                <h2>Defina su Rol</h2>
                <section className='rol__rolCard'>
                    <Link to="/signUpProductor" className='card2' >
                        <div className="rolCard ">
                            <div className="card__image">
                                <img src={Farmer} alt="farmer" />
                            </div>
                            <div className="card__title">
                                <h2>Productor</h2>
                            </div>
                        </div>
                    </Link>
                    <Link to="/signUpComprador" className='card2'>
                        <div className="rolCard">
                            <div className="card__image">
                                <img src={Person} alt="person" />
                            </div>
                            <div className="card__title">
                                <h2>Comprador</h2>
                            </div>
                        </div>
                    </Link>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Roless;
