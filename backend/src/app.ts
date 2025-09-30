import express from 'express';
import type{ Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import { errorMiddleware } from './middleware/error.middleware';
import { ApiResponse } from './advices/ApiResponse';
import { ApiError } from './advices/ApiError';
import sessionRouter from './routes/session.routes';
import userRouter from './routes/user.routes';
import productRouter from './routes/product.routes';
import categoryRouter from './routes/category.routes';
import cartRouter from './routes/cart.routes';
import wishlistRouter from './routes/wishlist.routes';
import orderRouter from './routes/order.routes';
import paymentRouter from './routes/payment.routes';

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

interface syntaxErrorWithBody extends SyntaxError {
    body?: any
}

app.use((err: syntaxErrorWithBody, req: Request, res: Response, next: NextFunction)=>{
    if(err instanceof SyntaxError && 'body' in err){
        return res.status(400).json( new ApiResponse(null, new ApiError(400, "Invalid JSON syntax in request body")) );
    }
    next(err);
})

// routes would be added here
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/session', sessionRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/payments', paymentRouter);



// error handling middleware would be added here
app.use(errorMiddleware);

export default app;

