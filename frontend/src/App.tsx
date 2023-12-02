import React, { FC, useContext, useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import CalcPi from './components/NumbersOfPiCalcForm'; // Import the CalcPi component
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import CalculationHistoryList from "./components/HistoryComponent";

const App: FC = () => {
    const { store } = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []);

    useEffect(() => {
        if (store.isAuth) {
            getUsers();
        }
    }, [store.isAuth]);

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (!store.isAuth) {
        return (

            <div className="container">

                <LoginForm />


            </div>
        );
    }

    return (
        <div className="container">
            <Navbar/>
            <div className="container">
                <h1>{`WELCOME LIL ${localStorage.getItem('username')} :3`}</h1>


            </div>
            <CalcPi />
            <CalcPi />
            <CalcPi />
            <CalculationHistoryList/>
        </div>
    );
};

export default observer(App);
