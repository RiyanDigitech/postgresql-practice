import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user-routes.js'
import todoRoutes from './routes/todo-routes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Register routes
app.use('/', userRoutes);
app.use('/', todoRoutes);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});