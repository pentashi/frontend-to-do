import React, { useState } from 'react';
import './TodoForm.css';

const TodoForm = ({ addTodo }) => {
    const [text, setText] = useState('');
    const [priority, setPriority] = useState('Medium'); // Default priority
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) {
            alert('Task description cannot be empty.');
            return;
        }

        addTodo({
            text,
            priority,
            dueDate,
            completed: false,
        });

        // Reset form fields
        setText('');
        setPriority('Medium');
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Achapi To-Do</h2>
            <div className="form-group">
                <label htmlFor="task">Task Description</label>
                <input
                    id="task"
                    type="text"
                    placeholder="Add a new task"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <button type="submit">Add Task</button>
        </form>
    );
};

export default TodoForm;
