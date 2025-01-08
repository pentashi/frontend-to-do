import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.css';

const url = process.env.REACT_APP_API_URL || 'https://backend-to-do-pa38.onrender.com';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        try {
            const response = await axios.post(`${url}/api/auth/login`, formData);
            const { accessToken, refreshToken } = response.data;
            
            if (accessToken) {
                login(accessToken);
                localStorage.setItem('authToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                setSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/todos');
                }, 1500);
            }
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid credentials');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <h2>Login</h2>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        value={formData.password}
                        required
                    />
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}

                <button type="submit" className={styles.submitButton}>Login</button>

                <p className={styles.signupPrompt}>
                    Don't have an account? <a href="/">Sign up here</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
