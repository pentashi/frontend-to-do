import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken') || null);

    const login = (accessToken, refreshToken) => {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setToken(null);
    };

    const updateToken = (newAccessToken) => {
        localStorage.setItem('authToken', newAccessToken);
        setToken(newAccessToken);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, updateToken }}>
            {children}
        </AuthContext.Provider>
    );
};
