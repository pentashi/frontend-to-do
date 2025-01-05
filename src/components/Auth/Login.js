
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import styles from './Login.css';
const url = process.env.REACT_APP_API_URL || 'https://backend-to-do-pa38.onrender.com';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext); // We use login from the context to save the token
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/auth/login`, formData);
            login(response.data.token);  // Save token in the context
        } catch (err) {
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

                <button type="submit" className={styles.submitButton}>Login</button>

                <p className={styles.signupPrompt}>
                    Don't have an account? <a href="/signup">Sign up here</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
