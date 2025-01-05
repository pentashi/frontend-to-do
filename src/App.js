import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import TodoForm from './components/TodoForm/TodoForm';
import TodoList from './components/TodoList/TodoList';
import axios from 'axios';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

const url = process.env.REACT_APP_API_URL || 'https://backend-to-do-pa38.onrender.com';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchTodos(token);
        }
    }, []);

    const fetchTodos = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/todos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos(response.data);
        } catch (err) {
            console.error('Failed to fetch todos:', err);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (todo) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(`${url}/api/todos`, todo, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos([...todos, response.data]);
        } catch (error) {
            alert('Error adding task. Please try again.');
        }
    };

    const toggleComplete = async (id) => {
        const todo = todos.find((todo) => todo._id === id);
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.patch(
                `${url}/api/todos/${id}`,
                { completed: !todo.completed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (err) {
            alert('Error updating todo. Please try again.');
        }
    };

    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`${url}/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (err) {
            alert('Error deleting todo. Please try again.');
        }
    };

    const editTodo = async (id, newText) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.patch(
                `${url}/api/todos/${id}`,
                { text: newText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (err) {
            alert('Error editing todo. Please try again.');
        }
    };

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />

                {/* Private Routes */}
                <Route
                    path="/todos"
                    element={
                        localStorage.getItem('authToken') ? (
                            <>
                                {loading ? (
                                    <p className="loading">Loading...</p>
                                ) : (
                                    <>
                                        <TodoForm addTodo={addTodo} />
                                        <TodoList
                                            todos={todos}
                                            toggleComplete={toggleComplete}
                                            deleteTodo={deleteTodo}
                                            editTodo={editTodo}
                                        />
                                    </>
                                )}
                            </>
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
