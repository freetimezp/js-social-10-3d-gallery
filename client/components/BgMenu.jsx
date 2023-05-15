import React from 'react';

import '../src/assets/css/style.css';

import BgMenuImg from '../public/img/bg-menu.jpg';

const BgMenu = () => {
    return (
        <div className="background_menu" id="menu-wrap">
            <div className="menu" id="menu">
                <div className="img_container" id="img-container">
                    <img src={BgMenuImg} alt="stars" />
                </div>

                <div className="content">
                    <h1>3D Art Gallery</h1>

                    <div>
                        <p>This is my first 3D Art Gallery.</p>
                        <p>Make with Threjs library and Love.</p>
                    </div>

                    <div>
                        <p><b>Instructions:</b></p>
                        <p>Arrow Keys and W/A/S/D</p>
                        <p>Look around with mouse</p>
                    </div>

                    <div id="play-button">
                        <p>Enter The Gallery</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BgMenu;
