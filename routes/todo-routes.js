import express from 'express';
import { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../services/todo-service.js';

const router = express.Router();

router.get('/api/todos', async (req, res) => {
    try {
        const todos = await getAllTodos();
        res.json(todos);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await getTodoById(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/api/todos', async (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }
    try {
        const todo = await createTodo(task);
        res.status(201).json(todo);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

router.put('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    try {
        const todo = await updateTodo(id, task, completed);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

router.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await deleteTodo(id);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;