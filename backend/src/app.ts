import express from 'express';
import type{ Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger/swagger.config';
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

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'E-Commerce API Documentation',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
    },
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

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

// API Root endpoint
app.get('/api/v1', (req: Request, res: Response) => {
    res.json(new ApiResponse({
        message: 'Welcome to E-Commerce API',
        version: '1.0.0',
        documentation: '/api-docs',
        endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            products: '/api/v1/products',
            categories: '/api/v1/categories',
            cart: '/api/v1/cart',
            wishlist: '/api/v1/wishlist',
            orders: '/api/v1/orders',
            payments: '/api/v1/payments',
            session: '/api/v1/session',
        }
    }));
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json(new ApiResponse({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    }));
});

// error handling middleware would be added here
app.use(errorMiddleware);

export default app;

