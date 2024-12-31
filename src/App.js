import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm/TodoForm';
import TodoList from './components/TodoList/TodoList';
import axios from 'axios';

const App = () => {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/todos');
            setTodos(response.data);
        } catch (err) {
            console.error('Error fetching todos:', err);
        }
    };

    const addTodo = async (todo) => {
        try {
            const response = await axios.post('http://localhost:5000/api/todos', todo);
            fetchTodos(); // Refresh the todos list
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleComplete = async (id) => {
        const todo = todos.find((todo) => todo._id === id);
        try {
            const response = await axios.patch(`http://localhost:5000/api/todos/${id}`, {
                completed: !todo.completed,
            });
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/todos/${id}`);
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (err) {
            console.error('Error deleting todo:', err);
        }
    };

    const editTodo = async (id, newText) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/todos/${id}`, {
                text: newText,
            });
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (err) {
            console.error('Error editing todo:', err);
        }
    };

    return (
        <div>
            <TodoForm addTodo={addTodo} />
            <TodoList
                todos={todos}
                toggleComplete={toggleComplete}
                deleteTodo={deleteTodo}
                editTodo={editTodo} // Pass the editTodo function here
            />
        </div>
    );
};

export default App;
