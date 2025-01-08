import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import TodoForm from './components/TodoForm/TodoForm';
import TodoList from './components/TodoList/TodoList';
import axios from 'axios';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import { AuthProvider } from './context/AuthContext';

const url = process.env.REACT_APP_API_URL || 'https://backend-to-do-pa38.onrender.com';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
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
            if (err.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (todo) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`${url}/api/todos`, todo, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos([...todos, response.data]);
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                alert('Error adding task. Please try again.');
            }
        }
    };

    const toggleComplete = async (id) => {
        const todo = todos.find((todo) => todo._id === id);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.patch(
                `${url}/api/todos/${id}`,
                { completed: !todo.completed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
            } else {
                alert('Error updating todo. Please try again.');
            }
        }
    };

    const deleteTodo = async (id) => {
        try {
            const token = localStorage.getItem('acessToken');
            await axios.delete(`${url}/api/todos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
            } else {
                alert('Error deleting todo. Please try again.');
            }
        }
    };

    const editTodo = async (id, newText) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.patch(
                `${url}/api/todos/${id}`,
                { text: newText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (err) {
            if (err.response?.status === 401) {
                handleLogout();
            } else {
                alert('Error editing todo. Please try again.');
            }
        }
    };

    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            axios.post(`${url}/api/auth/logout`, { refreshToken })
                .catch(err => console.error('Logout error:', err));
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    };

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={!isAuthenticated ? <Signup /> : <Navigate to="/todos" />} />
                    <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/todos" />} />
                    <Route path="/:userId/todos" element={<TodoList />} /> {/* Dynamic route for todos */}

                    {/* Protected Routes */}
                    <Route
                        path="/todos"
                        element={
                            isAuthenticated ? (
                                <div className="todo-container">
                                    <header className="app-header">
                                        <h1>Todo List</h1>
                                        <button onClick={handleLogout} className="logout-btn">
                                            Logout
                                        </button>
                                    </header>
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
                                </div>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
