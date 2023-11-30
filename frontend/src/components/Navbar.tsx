import React, { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../pic/logo.png';
const Navbar: FC = () => {

    return (
        <nav className ="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="#">
                <img src={logo} alt="Your Logo" width="40" height="40" className="d-inline-block " />
                CalcPi Now
            </a>
            <button className ="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className ="navbar-toggler-icon"></span>
            </button>
            <div className ="collapse navbar-collapse" id="navbarNav">
                <ul className ="navbar-nav mr-auto">
                    <li className ="nav-item active">
                        <a className ="nav-link" href="#">Home <span className ="sr-only">(current)</span></a>
                    </li>
                    <li className ="nav-item">
                        <a className ="nav-link" href="#">Current task</a>
                    </li>
                    <li className ="nav-item">
                        <a className ="nav-link" href="#">History</a>
                    </li>

                </ul>
            </div>
        </nav>

    );
};

export default observer(Navbar);
