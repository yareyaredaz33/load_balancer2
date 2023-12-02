import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import logo from '../pic/logo.png';
import './Navbar.css'; // Create a CSS file for Navbar styling

const Navbar: FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={logo} alt="Your Logo" width="40" height="40" className="logo" />
                <span className="brand-name">CalcPi Now</span>
            </div>
            <div className="navbar-links">
                <ul>
                    <li>
                        <a href="#" className="nav-link">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link">
                            Current task
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link">
                            History
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default observer(Navbar);
