import express from 'express';
import bcrypt from 'bcrypt';
import { checkEmailExists, createUser, getAllUsers, getUserById } from '../services/user-service.js';

const router = express.Router();

router.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    try {
        if (await checkEmailExists(email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await createUser(name, email, hashedPassword);
        res.status(201).json(user);
    } catch (err) {
        console.error(err?.stack);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/api/users', async (req, res) => {
    try {
        const users = await getAllUsers();
        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }
        res.json(users);
    } catch (err) {
        console.error('Get users error:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
        if (err.code === '42P01') {
            return res.status(500).json({ error: 'Users table does not exist. Please create it.' });
        } else if (err.code === 'ECONNREFUSED' || err.code === '28P01') {
            return res.status(500).json({ error: 'Database connection failed. Check your configuration.' });
        }
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

router.get('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get user error:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
        });
        if (err.code === '42P01') {
            return res.status(500).json({ error: 'Users table does not exist. Please create it.' });
        } else if (err.code === 'ECONNREFUSED' || err.code === '28P01') {
            return res.status(500).json({ error: 'Database connection failed. Check your configuration.' });
        }
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});

export default router;