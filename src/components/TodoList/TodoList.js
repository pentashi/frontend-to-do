import React, { useState } from 'react';
import './TodoList.css';

const TodoList = ({ todos, toggleComplete, deleteTodo, editTodo }) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ text: '', priority: '', dueDate: '' });

    const handleEditClick = (todo) => {
        setEditingId(todo._id);
        setEditData({
            text: todo.text,
            priority: todo.priority || 'Medium',
            dueDate: todo.dueDate || '',
        });
    };

    const handleSaveClick = (id) => {
        editTodo(id, editData);
        setEditingId(null);
    };

    const handleInputChange = (field, value) => {
        setEditData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const getPriorityValue = (priority) => {
        if (priority === 'High') return 3;
        if (priority === 'Medium') return 2;
        return 1; // Low
    };

    const sortedTodos = [...todos].sort(
        (a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority)
    );

    const activeTodos = sortedTodos.filter((todo) => !todo.completed);
    const completedTodos = sortedTodos.filter((todo) => todo.completed);

    const renderPriorityStars = (priority) => {
        const starsCount = getPriorityValue(priority);
        return '★'.repeat(starsCount) + '☆'.repeat(3 - starsCount);
    };

    return (
        <div className="todo-container">
            <section className="active-tasks">
                <h2>Active Tasks</h2>
                {activeTodos.length > 0 ? (
                    <ul className="todo-list">
                        {activeTodos.map((todo) => (
                            <li key={todo._id} className="todo-item">
                                <div className="todo-content">
                                    <label className="checkbox-label">
                                     Completed:
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleComplete(todo._id)}
                                        />
                                    </label>
                                    {editingId === todo._id ? (
                                        <div className="edit-section">
                                            <input
                                                type="text"
                                                value={editData.text}
                                                className="edit-input"
                                                onChange={(e) => handleInputChange('text', e.target.value)}
                                            />
                                            <select
                                                value={editData.priority}
                                                className="edit-priority"
                                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                            >
                                                <option value="High">High</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                            <input
                                                type="date"
                                                value={editData.dueDate}
                                                className="edit-due-date"
                                                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                            />
                                            <button onClick={() => handleSaveClick(todo._id)} className="save-btn">
                                                Save
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="cancel-btn">
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                                <span className="todo-text">
                                                    <label className='taskname'>Task Name:</label>
                                                {todo.text}</span>
                                            <span className="todo-priority">
                                            <label className='priority'>Priority:</label>
                                            {todo.priority || 'Medium'} ({renderPriorityStars(todo.priority)})
                                            </span>
                                            <span className="todo-due-date">
                                            <label className='due-date'>Due Date:</label>
                                            {todo.dueDate || 'Not set'}
                                            </span>
                                            <div className="action-buttons">
                                                <button onClick={() => handleEditClick(todo)} className="edit-btn">
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteTodo(todo._id)} className="delete-btn">
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No active tasks. Add some!</p>
                )}
            </section>

            <section className="completed-tasks">
                <h2>Completed Tasks</h2>
                {completedTodos.length > 0 ? (
                    <ul className="todo-list">
                        {completedTodos.map((todo) => (
                            <li key={todo._id} className="todo-item completed">
                                <div className="todo-content">
                                    <label className="checkbox-label">
                                        Completed:
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() => toggleComplete(todo._id)}
                                        />
                                    </label>
                                    <span className="todo-text">{todo.text}</span>
                                    <span className="todo-priority">
                                        Priority: {todo.priority || 'Medium'} ({renderPriorityStars(todo.priority)})
                                    </span>
                                    <span className="todo-due-date">
                                        Due Date: {todo.dueDate || 'Not set'}
                                    </span>
                                    <div className="action-buttons">
                                        <button onClick={() => deleteTodo(todo._id)} className="delete-btn">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No completed tasks yet.</p>
                )}
            </section>
        </div>
    );
};

export default TodoList;
