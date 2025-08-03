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

// export const getAllUsers = async () => {
//     const result = await pool.query('SELECT id, name, email, created_at FROM users');
//     return result.rows;
// };
// export async function getAllUsers({ limit, offset, nameFilter }) {
//     try {
//         let query = 'SELECT * FROM users';
//         let countQuery = 'SELECT COUNT(*) FROM users';
//         const queryParams = [];

//         if (nameFilter && nameFilter.length > 0) {
//             query += ' WHERE name ILIKE ANY ($1)';
//             countQuery += ' WHERE name ILIKE ANY ($1)';
//             queryParams.push(nameFilter.map(name => `%${name}%`));
//         }

//         query += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
//         queryParams.push(limit, offset);

//         console.log('Query:', query); // Debug query
//         console.log('Params:', queryParams); // Debug parameters

//         const usersResult = await pool.query(query, queryParams);
//         const countResult = await pool.query(countQuery, nameFilter ? [nameFilter.map(name => `%${name}%`)] : []);

//         console.log('Users Result:', usersResult); // Debug result
//         console.log('Count Result:', countResult); // Debug count

//         if (!usersResult || !usersResult.rows) {
//             throw new Error('No users data returned from database');
//         }

//         return {
//             users: usersResult.rows,
//             total: parseInt(countResult.rows[0].count, 10),
//         };
//     } catch (err) {
//         console.error('getAllUsers Error:', err);
//         throw err;
//     }
// }


export async function getAllUsers({ limit, offset, nameFilter }) {
    try {
        let query = 'SELECT * FROM users';
        let countQuery = 'SELECT COUNT(*) FROM users';
        const queryParams = [];

        if (nameFilter && nameFilter.length > 0) {
            query += ' WHERE name ILIKE ANY ($1)';
            countQuery += ' WHERE name ILIKE ANY ($1)';
            queryParams.push(nameFilter.map(name => `%${name}%`));
        }

        query += ' ORDER BY created_at DESC LIMIT $' + (queryParams.length + 1) + ' OFFSET $' + (queryParams.length + 2);
        queryParams.push(limit, offset);

        console.log('Query:', query);
        console.log('Params:', queryParams);

        const usersResult = await pool.query(query, queryParams);
        const countResult = await pool.query(countQuery, nameFilter ? [nameFilter.map(name => `%${name}%`)] : []);

        console.log('Users Result:', usersResult.rows);
        console.log('Count Result:', countResult.rows);

        return {
            users: usersResult.rows || [], // Fallback to empty array
            total: parseInt(countResult.rows[0]?.count || 0, 10),
        };
    } catch (err) {
        console.error('getAllUsers Error:', err);
        throw err;
    }
}
export const getUserById = async (id) => {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
};