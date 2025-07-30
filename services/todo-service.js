import pool from '../config/database.js';

export const getAllTodos = async () => {
    const result = await pool.query('SELECT * FROM todos');
    return result.rows;
};

export const getTodoById = async (id) => {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    return result.rows[0];
};

export const createTodo = async (task) => {
    const result = await pool.query('INSERT INTO todos (task) VALUES ($1) RETURNING *', [task]);
    return result.rows[0];
};

export const updateTodo = async (id, task, completed) => {
    const result = await pool.query(
        'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *',
        [task, completed, id]
    );
    return result.rows[0];
};

export const deleteTodo = async (id) => {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};