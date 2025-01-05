import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import styles from './Signup.css';
const url = process.env.REACT_APP_API_URL || 'https://backend-to-do-pa38.onrender.com';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login } = useContext(AuthContext);  // Use login to save the token
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/auth/signup`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(formData)
            login(response.data.token);  // Save token in the context
        } catch (err) {
            setError('Signup failed');
        }
    };

    return (
        <div className={styles.signupContainer}>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
                <h2>Signup</h2>
                
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        onChange={handleChange}
                        value={formData.name}
                        required
                    />
                </div>

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

                <button type="submit" className={styles.submitButton}>Signup</button>

                <p className={styles.loginPrompt}>
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
