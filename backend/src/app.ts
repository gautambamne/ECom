import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));

app.use(express.json({
    limit: '50kb',
}));

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.static('public'));

app.use(cookieParser());

// rotes would be added here
app.use('/api/v1/auth', authRouter);



// error handling middleware would be added here
app.use(errorMiddleware);

export default app;

