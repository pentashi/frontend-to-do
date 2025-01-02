import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm/TodoForm';
import TodoList from './components/TodoList/TodoList';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL || 'https://backend-to-do-pa38.onrender.com';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/todos`);
            setTodos(response.data);
        } catch (err) {
            alert('Failed to fetch todos. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (todo) => {
        try {
            const response = await axios.post(`${url}/api/todos`, todo);
            setTodos([...todos, response.data]);
        } catch (error) {
            alert('Error adding task. Please try again.');
        }
    };

    const toggleComplete = async (id) => {
        const todo = todos.find((todo) => todo._id === id);
        try {
            const response = await axios.patch(`${url}/api/todos/${id}`, {
                completed: !todo.completed,
            });
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (err) {
            alert('Error updating todo. Please try again.');
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${url}/api/todos/${id}`);
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (err) {
            alert('Error deleting todo. Please try again.');
        }
    };

    const editTodo = async (id, newText) => {
        try {
            const response = await axios.patch(`${url}/api/todos/${id}`, {
                text: newText,
            });
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (err) {
            alert('Error editing todo. Please try again.');
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
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
    );
};

export default App;
