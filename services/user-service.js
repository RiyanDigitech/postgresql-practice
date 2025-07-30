import pool from '../config/database.js';

export const checkEmailExists = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length > 0;
};

export const createUser = async (name, email, hashedPassword) => {
    const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
        [name, email, hashedPassword]
    );
    return result.rows[0];
};

export const getAllUsers = async () => {
    const result = await pool.query('SELECT id, name, email, created_at FROM users');
    return result.rows;
};

export const getUserById = async (id) => {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
};