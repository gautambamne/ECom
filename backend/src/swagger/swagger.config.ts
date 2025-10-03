import swaggerJSDoc from 'swagger-jsdoc';
import type { OpenAPIV3 } from 'openapi-types';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce API',
    version: '1.0.0',
    description: 'A comprehensive e-commerce API with authentication, products, cart, orders, and payments',
    contact: {
      name: 'API Support',
      email: 'support@ecommerce.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Development server',
    },
    {
      url: 'https://api.ecommerce.com/api/v1',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
      },
    },
    schemas: {
      // User schemas
      User: {
        type: 'object',
        required: ['id', 'name', 'email', 'role', 'isVerified'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the user',
          },
          name: {
            type: 'string',
            description: 'User\'s full name',
            minLength: 3,
            maxLength: 50,
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User\'s email address',
          },
          role: {
            type: 'string',
            enum: ['USER', 'VENDOR', 'ADMIN'],
            description: 'User\'s role in the system',
          },
          isVerified: {
            type: 'boolean',
            description: 'Whether the user\'s email is verified',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'User last update timestamp',
          },
        },
      },
      
      // Auth schemas
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
            description: 'User\'s full name',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User\'s email address',
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User\'s password',
          },
        },
      },
      
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User\'s email address',
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User\'s password',
          },
        },
      },
      
      VerifyRequest: {
        type: 'object',
        required: ['email', 'verification_code'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User\'s email address',
          },
          verification_code: {
            type: 'string',
            minLength: 6,
            maxLength: 6,
            description: '6-digit verification code',
          },
        },
      },
      
      // Product schemas
      Product: {
        type: 'object',
        required: ['id', 'name', 'description', 'price', 'categoryId', 'vendorId'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the product',
          },
          name: {
            type: 'string',
            description: 'Product name',
          },
          description: {
            type: 'string',
            description: 'Product description',
          },
          price: {
            type: 'number',
            format: 'decimal',
            description: 'Product price',
          },
          stock: {
            type: 'integer',
            minimum: 0,
            description: 'Available stock quantity',
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
              format: 'url',
            },
            description: 'Product image URLs',
          },
          categoryId: {
            type: 'string',
            description: 'Category identifier',
          },
          vendorId: {
            type: 'string',
            description: 'Vendor identifier',
          },
          shoeSize: {
            type: 'string',
            enum: ['UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11'],
            description: 'Shoe size (if applicable)',
          },
          shoeColor: {
            type: 'string',
            enum: ['RED', 'BLACK', 'WHITE', 'BLUE', 'GREEN', 'YELLOW', 'GREY'],
            description: 'Shoe color (if applicable)',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Product creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Product last update timestamp',
          },
        },
      },
      
      CreateProductRequest: {
        type: 'object',
        required: ['name', 'description', 'price', 'categoryId'],
        properties: {
          name: {
            type: 'string',
            description: 'Product name',
          },
          description: {
            type: 'string',
            description: 'Product description',
          },
          price: {
            type: 'number',
            format: 'decimal',
            description: 'Product price',
          },
          stock: {
            type: 'integer',
            minimum: 0,
            description: 'Available stock quantity',
          },
          categoryId: {
            type: 'string',
            description: 'Category identifier',
          },
          shoeSize: {
            type: 'string',
            enum: ['UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11'],
            description: 'Shoe size (if applicable)',
          },
          shoeColor: {
            type: 'string',
            enum: ['RED', 'BLACK', 'WHITE', 'BLUE', 'GREEN', 'YELLOW', 'GREY'],
            description: 'Shoe color (if applicable)',
          },
        },
      },
      
      // Category schema
      Category: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the category',
          },
          name: {
            type: 'string',
            description: 'Category name',
          },
          description: {
            type: 'string',
            description: 'Category description',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Category creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Category last update timestamp',
          },
        },
      },
      
      // Cart schemas
      CartItem: {
        type: 'object',
        required: ['id', 'productId', 'quantity'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the cart item',
          },
          productId: {
            type: 'string',
            description: 'Product identifier',
          },
          quantity: {
            type: 'integer',
            minimum: 1,
            description: 'Quantity of the product',
          },
          product: {
            $ref: '#/components/schemas/Product',
          },
        },
      },
      
      Cart: {
        type: 'object',
        required: ['id', 'userId', 'items'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the cart',
          },
          userId: {
            type: 'string',
            description: 'User identifier',
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CartItem',
            },
            description: 'Cart items',
          },
          totalAmount: {
            type: 'number',
            format: 'decimal',
            description: 'Total cart amount',
          },
        },
      },
      
      // Order schemas
      Order: {
        type: 'object',
        required: ['id', 'userId', 'status', 'totalAmount'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the order',
          },
          userId: {
            type: 'string',
            description: 'User identifier',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            description: 'Order status',
          },
          totalAmount: {
            type: 'number',
            format: 'decimal',
            description: 'Total order amount',
          },
          shippingAddress: {
            type: 'string',
            description: 'Shipping address',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Order creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Order last update timestamp',
          },
        },
      },
      
      // Payment schema
      Payment: {
        type: 'object',
        required: ['id', 'orderId', 'amount', 'status'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the payment',
          },
          orderId: {
            type: 'string',
            description: 'Order identifier',
          },
          amount: {
            type: 'number',
            format: 'decimal',
            description: 'Payment amount',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'SUCCESS', 'FAILED'],
            description: 'Payment status',
          },
          paymentMethod: {
            type: 'string',
            description: 'Payment method used',
          },
          transactionId: {
            type: 'string',
            description: 'Transaction identifier',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Payment creation timestamp',
          },
        },
      },
      
      // Response schemas
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            description: 'Response message',
          },
          data: {
            type: 'object',
            description: 'Response data',
          },
          error: {
            type: 'object',
            description: 'Error details (if any)',
          },
        },
      },
      
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
            description: 'Always false for error responses',
          },
          message: {
            type: 'string',
            description: 'Error message',
          },
          error: {
            type: 'object',
            properties: {
              code: {
                type: 'integer',
                description: 'Error code',
              },
              details: {
                type: 'string',
                description: 'Error details',
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
    {
      cookieAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/swagger/paths/*.yaml',
  ],
};

export const swaggerSpec = swaggerJSDoc(options) as OpenAPIV3.Document;