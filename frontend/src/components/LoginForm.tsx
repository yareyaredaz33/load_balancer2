import React, { FC, useContext, useState } from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import './LoginForm.css';

const LoginForm: FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { store } = useContext(Context);

    return (
        <div>
            <div className="input-container">
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                    placeholder="Username"
                />
            </div>
            <div className="input-container">
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Password"
                />
            </div>
            <div className="button-container">
                <button onClick={() => store.login(username, password)}>Login</button>
                <button onClick={() => store.registration(username, password)}>Register</button>
            </div>
        </div>
    );
};

export default observer(LoginForm);
