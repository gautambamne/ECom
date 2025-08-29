import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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




// error handling middleware would be added here

export default app;

