import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('API Running');
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));