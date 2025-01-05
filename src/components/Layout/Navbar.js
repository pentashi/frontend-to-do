// src/components/Layout/Navbar.js
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { auth, logout } = useContext(AuthContext);
    const history = useHistory();

    const handleLogout = () => {
        logout();
        history.push('/login');
    };

    return (
        <nav>
            <h1>Todo App</h1>
            <ul>
                {auth.token ? (
                    <>
                        <li><Link to="/todos">Todos</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/signup">Signup</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
