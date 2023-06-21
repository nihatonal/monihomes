import React from 'react';

import Hero from './hero/Hero';
import AboutUs from './aboutus/AboutUs';
import './Main.css';
function Main(props) {
    return (
        <div className="main_container">
            <Hero />
            <AboutUs />
        </div>
    );
}

export default Main;