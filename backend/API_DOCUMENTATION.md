# E-Commerce API Documentation

A comprehensive RESTful API for an e-commerce platform built with Express.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control (USER, VENDOR, ADMIN)
- **User Management**: User registration, email verification, profile management
- **Product Management**: CRUD operations for products with image upload
- **Category Management**: Product categorization system
- **Shopping Cart**: Add, update, remove items from cart
- **Wishlist**: Save products for later
- **Order Management**: Place orders, track status, order history
- **Payment Processing**: Payment creation and confirmation system
- **Session Management**: Multi-device session handling
- **Search & Filtering**: Advanced product search with filters

## 📚 API Documentation

### Interactive Documentation
Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) to access the interactive Swagger UI documentation.

### JSON Schema
Get the OpenAPI specification: [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)

## 🏗️ Architecture

```
src/
├── advices/           # Custom response and error classes
├── controllers/       # Route handlers
├── db/               # Database connection and Redis setup
├── middleware/       # Authentication, validation, and error middleware
├── repositories/     # Data access layer
├── routes/          # API route definitions
├── schema/          # Zod validation schemas
├── services/        # Business logic layer
├── swagger/         # API documentation
├── utils/           # Utility functions
└── app.ts           # Express app configuration
```

## 🔐 Authentication

The API uses JWT tokens for authentication with two types:
- **Access Token**: Short-lived (12 hours), used for API requests
- **Refresh Token**: Long-lived (7 days), used to refresh access tokens

### Authentication Methods
1. **Bearer Token**: Include `Authorization: Bearer <token>` header
2. **HTTP-Only Cookie**: Tokens are automatically sent as secure cookies

## 📋 API Endpoints Overview

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /verify` - Verify email address
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh access token
- `POST /forgot-password` - Request password reset
- `POST /check-verification-code` - Validate reset code
- `POST /reset-password` - Reset password
- `POST /resend-verification-code` - Resend verification code

### Users (`/api/v1/users`)
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `GET /` - Get all users (Admin only)
- `GET /:id` - Get user by ID (Admin only)
- `PUT /:id` - Update user (Admin only)
- `DELETE /:id` - Delete user (Admin only)

### Products (`/api/v1/products`)
- `GET /` - Get all products with search/filter
- `POST /` - Create product (Vendor only)
- `GET /:id` - Get product by ID
- `PUT /:id` - Update product (Vendor only)
- `DELETE /:id` - Delete product (Vendor only)
- `GET /categories/:categoryId` - Get products by category
- `GET /vendor/my-products` - Get vendor's products

### Categories (`/api/v1/categories`)
- `GET /` - Get all categories
- `POST /` - Create category (Admin only)
- `GET /:id` - Get category by ID
- `PUT /:id` - Update category (Admin only)
- `DELETE /:id` - Delete category (Admin only)

### Cart (`/api/v1/cart`)
- `GET /` - Get user's cart
- `POST /add` - Add item to cart
- `PUT /update/:itemId` - Update cart item quantity
- `DELETE /remove/:itemId` - Remove item from cart
- `DELETE /clear` - Clear entire cart

### Wishlist (`/api/v1/wishlist`)
- `GET /` - Get user's wishlist
- `POST /add` - Add item to wishlist
- `DELETE /remove/:productId` - Remove item from wishlist
- `DELETE /clear` - Clear entire wishlist
- `POST /move-to-cart/:productId` - Move item to cart

### Orders (`/api/v1/orders`)
- `GET /` - Get user's orders
- `POST /` - Create new order
- `GET /:id` - Get order by ID
- `PUT /:id/cancel` - Cancel order
- `PUT /:id/status` - Update order status (Admin/Vendor)

### Payments (`/api/v1/payments`)
- `GET /` - Get user's payments
- `POST /create` - Create payment
- `GET /:id` - Get payment by ID
- `PUT /:id/confirm` - Confirm payment
- `PUT /:id/refund` - Refund payment (Admin only)

### Session (`/api/v1/session`)
- `GET /validate` - Validate current session
- `GET /info` - Get session information
- `POST /extend` - Extend session
- `POST /terminate` - Terminate current session
- `GET /all` - Get all user sessions
- `POST /terminate-all` - Terminate all other sessions
- `DELETE /terminate/:sessionId` - Terminate specific session

## 🎯 Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "error": {
    "code": 400,
    "details": "Detailed error information"
  }
}
```

## 🔍 Search & Filtering

### Product Search Parameters
- `search` - Search in product name and description
- `category` - Filter by category ID
- `minPrice` / `maxPrice` - Price range filtering
- `shoeSize` - Filter by shoe size (UK6-UK11)
- `shoeColor` - Filter by color
- `page` / `limit` - Pagination
- `sortBy` / `sortOrder` - Sorting options

### Example Search Request
```
GET /api/v1/products?search=nike&category=cat123&minPrice=50&maxPrice=150&shoeSize=UK9&page=1&limit=10&sortBy=price&sortOrder=asc
```

## 🛡️ Security Features

- **JWT Authentication** with secure HTTP-only cookies
- **Role-based Access Control** (USER, VENDOR, ADMIN)
- **Input Validation** using Zod schemas
- **Rate Limiting** on sensitive endpoints
- **CORS Configuration** for frontend integration
- **SQL Injection Protection** via Prisma ORM
- **Password Hashing** with bcrypt

## 📊 Database Schema

The API uses PostgreSQL with the following main entities:
- **Users** - User accounts with roles
- **Products** - Product catalog with categories
- **Categories** - Product categorization
- **Cart/CartItems** - Shopping cart functionality
- **Wishlist/WishlistItems** - Wishlist functionality
- **Orders/OrderItems** - Order management
- **Payments** - Payment processing
- **Sessions** - User session management

## 🚦 Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

## 🔧 Development

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis (for session management)

### Environment Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Running the API
```bash
# Install dependencies
bun install

# Run database migrations
bunx prisma migrate dev

# Start development server
bun run dev

# Generate Prisma client
bunx prisma generate
```

### API Testing
Use the Swagger UI at `/api-docs` or import the OpenAPI specification into Postman/Insomnia.

## 📝 Changelog

### Version 1.0.0
- Initial API release
- Complete authentication system
- Product and category management
- Cart and wishlist functionality
- Order and payment processing
- Session management
- Comprehensive documentation

## 📞 Support

For API support or questions:
- Documentation: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- Health Check: [http://localhost:5000/health](http://localhost:5000/health)
- API Root: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

---

*Last updated: October 2025*