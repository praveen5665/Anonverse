import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {connectDB} from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'
import communityRoutes from './routes/communityRoutes.js'
import postRoutes from './routes/postRoutes.js'

dotenv.config();

const app = express();

connectDB();

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.send('API Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/r', communityRoutes);
app.use('/api/post', postRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));