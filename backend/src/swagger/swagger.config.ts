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
      url: 'https://api.ecommerce.com/v1',
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
      // Generic API Response schema
      ApiResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp in ISO format',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            description: 'Response data payload',
            oneOf: [
              { type: 'object' },
              { type: 'array' },
              { type: 'string' },
              { type: 'number' },
              { type: 'boolean' },
              { type: 'null' }
            ],
          },
          api_error: {
            oneOf: [
              { $ref: '#/components/schemas/ErrorResponse' },
              { type: 'null' }
            ],
            description: 'Error information if request failed',
          },
        },
      },

      // Authentication request schemas
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 100,
            description: 'User full name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User password (min 6 characters)',
            example: 'password123',
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
            description: 'User email address',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            minLength: 6,
            description: 'User password',
            example: 'password123',
          },
        },
      },

      VerifyEmailRequest: {
        type: 'object',
        required: ['email', 'verification_code'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
          verification_code: {
            type: 'string',
            minLength: 6,
            maxLength: 6,
            pattern: '^[0-9]{6}$',
            description: '6-digit verification code',
            example: '123456',
          },
        },
      },

      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
        },
      },

      ResetPasswordRequest: {
        type: 'object',
        required: ['email', 'verification_code', 'newPassword'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
          verification_code: {
            type: 'string',
            minLength: 6,
            maxLength: 6,
            pattern: '^[0-9]{6}$',
            description: '6-digit verification code',
            example: '123456',
          },
          newPassword: {
            type: 'string',
            minLength: 6,
            description: 'New password (min 6 characters)',
            example: 'newpassword123',
          },
        },
      },

      ResendVerificationCodeRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
        },
      },

      CheckVerificationCodeRequest: {
        type: 'object',
        required: ['email', 'verification_code'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
          verification_code: {
            type: 'string',
            minLength: 6,
            maxLength: 6,
            pattern: '^[0-9]{6}$',
            description: '6-digit verification code',
            example: '123456',
          },
        },
      },

      // User schema
      User: {
        type: 'object',
        required: ['id', 'name', 'email', 'role', 'is_verified', 'created_at', 'updated_at'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique user identifier',
            example: 'cm1abc123def456',
          },
          name: {
            type: 'string',
            description: 'User full name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
          role: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['USER', 'ADMIN', 'SELLER'],
            },
            description: 'User roles',
            example: ['USER'],
          },
          is_verified: {
            type: 'boolean',
            description: 'Email verification status',
            example: true,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation timestamp',
            example: '2024-01-15T10:30:00Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },

      // Product schema
      Product: {
        type: 'object',
        required: ['id', 'name', 'price', 'stock', 'created_at', 'updated_at'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique product identifier',
            example: 'prod123',
          },
          name: {
            type: 'string',
            description: 'Product name',
            example: 'Nike Air Force 1',
          },
          description: {
            type: 'string',
            description: 'Product description',
            example: 'Classic basketball sneakers',
          },
          brand: {
            type: 'string',
            description: 'Product brand',
            example: 'Nike',
          },
          images: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Product image URLs',
            example: ['https://example.com/image1.jpg'],
          },
          price: {
            type: 'number',
            format: 'float',
            description: 'Product price',
            example: 89.99,
          },
          stock: {
            type: 'integer',
            description: 'Available stock quantity',
            example: 50,
          },
          categories: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Category',
            },
            description: 'Product categories',
          },
          variants: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ProductVariant',
            },
            description: 'Product variants (size, color, stock)',
          },
          vendor: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Vendor ID',
                example: 'vendor123',
              },
              name: {
                type: 'string',
                description: 'Vendor name',
                example: 'Nike Store',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Vendor email',
                example: 'vendor@nike.com',
              },
            },
            description: 'Product vendor information',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Product creation timestamp',
            example: '2024-01-15T10:30:00Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },

      // ProductVariant schema
      ProductVariant: {
        type: 'object',
        required: ['size', 'color', 'stock'],
        properties: {
          id: {
            type: 'string',
            description: 'Variant ID',
            example: 'variant123',
          },
          size: {
            type: 'string',
            description: 'Product size',
            example: 'UK9',
            enum: ['UK6', 'UK7', 'UK8', 'UK9', 'UK10', 'UK11'],
          },
          color: {
            type: 'string',
            description: 'Product color',
            example: 'WHITE',
            enum: ['RED', 'BLACK', 'WHITE', 'BLUE', 'GREEN', 'YELLOW', 'GREY'],
          },
          stock: {
            type: 'integer',
            description: 'Stock for this variant',
            example: 10,
          },
          product_id: {
            type: 'string',
            description: 'Parent product ID',
            example: 'prod123',
          },
        },
      },

      // CartItem schema
      CartItem: {
        type: 'object',
        required: ['id', 'quantity', 'product_id', 'cart_id', 'product'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique cart item identifier',
            example: 'item123',
          },
          quantity: {
            type: 'integer',
            description: 'Quantity of the product in cart',
            example: 2,
          },
          product_id: {
            type: 'string',
            description: 'Product ID',
            example: 'prod123',
          },
          cart_id: {
            type: 'string',
            description: 'Cart ID',
            example: 'cart123',
          },
          product: {
            type: 'object',
            required: ['id', 'name', 'price', 'images', 'brand', 'stock'],
            properties: {
              id: {
                type: 'string',
                description: 'Product ID',
                example: 'prod123',
              },
              name: {
                type: 'string',
                description: 'Product name',
                example: 'Nike Air Force 1',
              },
              price: {
                type: 'number',
                format: 'float',
                description: 'Product price',
                example: 89.99,
              },
              images: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'Product image URLs',
                example: ['https://example.com/image1.jpg'],
              },
              brand: {
                type: 'string',
                description: 'Product brand',
                example: 'Nike',
              },
              stock: {
                type: 'integer',
                description: 'Available stock quantity',
                example: 50,
              },
            },
            description: 'Product details',
          },
        },
      },

      // Cart schema
      Cart: {
        type: 'object',
        required: ['id', 'user_id', 'items'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique cart identifier',
            example: 'cart123',
          },
          user_id: {
            type: 'string',
            description: 'User ID who owns the cart',
            example: 'user123',
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/CartItem',
            },
            description: 'Cart items',
          },
        },
      },

      // OrderItem schema
      OrderItem: {
        type: 'object',
        required: ['id', 'quantity', 'price', 'order_id', 'product_id'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique order item identifier',
            example: 'orderItem123',
          },
          quantity: {
            type: 'integer',
            description: 'Quantity ordered',
            example: 2,
          },
          price: {
            type: 'number',
            format: 'float',
            description: 'Price per unit at time of order',
            example: 89.99,
          },
          order_id: {
            type: 'string',
            description: 'Order ID',
            example: 'order123',
          },
          product_id: {
            type: 'string',
            description: 'Product ID',
            example: 'prod123',
          },
          product: {
            $ref: '#/components/schemas/Product',
          },
        },
      },

      // Payment schema
      Payment: {
        type: 'object',
        required: ['id', 'amount', 'status', 'method', 'created_at'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique payment identifier',
            example: 'payment123',
          },
          amount: {
            type: 'number',
            format: 'float',
            description: 'Payment amount',
            example: 179.98,
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'SUCCESS', 'FAILED'],
            description: 'Payment status',
            example: 'COMPLETED',
          },
          method: {
            type: 'string',
            description: 'Payment method',
            example: 'card',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Payment creation timestamp',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },

      // Order schema
      Order: {
        type: 'object',
        required: ['id', 'status', 'total_price', 'created_at', 'user_id'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique order identifier',
            example: 'order123',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            description: 'Order status',
            example: 'CONFIRMED',
          },
          total_price: {
            type: 'number',
            format: 'float',
            description: 'Total order amount',
            example: 179.98,
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Order creation timestamp',
            example: '2023-10-01T10:00:00.000Z',
          },
          user_id: {
            type: 'string',
            description: 'User ID who placed the order',
            example: 'user123',
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/OrderItem',
            },
            description: 'Order items',
          },
          payment: {
            $ref: '#/components/schemas/Payment',
          },
        },
      },

      // Response schemas - Updated to match actual ApiResponse format
      AuthSuccessResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-03T10:30:00.000Z',
          },
          data: {
            type: 'object',
            required: ['user', 'access_token', 'message'],
            properties: {
              user: {
                $ref: '#/components/schemas/User',
              },
              access_token: {
                type: 'string',
                description: 'JWT access token',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
              message: {
                type: 'string',
                example: 'Authentication successful',
                description: 'Success message',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      RegisterSuccessResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-03T10:30:00.000Z',
          },
          data: {
            type: 'object',
            required: ['user', 'message'],
            properties: {
              user: {
                $ref: '#/components/schemas/User',
              },
              message: {
                type: 'string',
                example: 'Account Successfullty Registered',
                description: 'Success message',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      BasicSuccessResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-03T10:30:00.000Z',
          },
          data: {
            type: 'object',
            required: ['message'],
            properties: {
              message: {
                type: 'string',
                description: 'Success message',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      RefreshTokenResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-03T10:30:00.000Z',
          },
          data: {
            type: 'object',
            required: ['access_token', 'message'],
            properties: {
              access_token: {
                type: 'string',
                description: 'New JWT access token',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              },
              message: {
                type: 'string',
                example: 'Access token refreshed successfully',
                description: 'Success message',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      // Error Response schemas - Updated to match actual ApiResponse format
      ValidationErrorResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-03T10:30:00.000Z',
          },
          data: {
            type: 'null',
            example: null,
          },
          api_error: {
            type: 'object',
            required: ['status_code', 'message', 'errors'],
            properties: {
              status_code: {
                type: 'integer',
                example: 400,
                description: 'HTTP status code',
              },
              message: {
                type: 'string',
                example: 'validation Error',
                description: 'Error message',
              },
              errors: {
                type: 'object',
                description: 'Detailed validation errors',
                additionalProperties: {
                  type: 'string',
                },
                example: {
                  'email': 'Invalid email address',
                  'password': 'Password must be at least 6 characters'
                },
              },
            },
          },
        },
      },

      AuthErrorResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-03T10:30:00.000Z',
          },
          data: {
            type: 'null',
            example: null,
          },
          api_error: {
            type: 'object',
            required: ['status_code', 'message'],
            properties: {
              status_code: {
                type: 'integer',
                description: 'HTTP status code',
              },
              message: {
                type: 'string',
                description: 'Error message',
              },
              errors: {
                type: 'object',
                description: 'Additional error details',
                additionalProperties: {
                  type: 'string',
                },
                example: {},
              },
            },
          },
        },
      },

      ErrorResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-03T10:30:00.000Z',
          },
          data: {
            type: 'null',
            example: null,
          },
          api_error: {
            type: 'object',
            required: ['status_code', 'message'],
            properties: {
              status_code: {
                type: 'integer',
                description: 'HTTP status code',
              },
              message: {
                type: 'string',
                description: 'Error message',
              },
              errors: {
                type: 'object',
                description: 'Additional error details',
                additionalProperties: {
                  type: 'string',
                },
                example: {},
              },
            },
          },
        },
      },

      Session: {
        type: 'object',
        required: ['id', 'token', 'ip_address', 'user_agent', 'expire_at', 'created_at', 'user_id'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique session identifier',
            example: 'session-uuid-123',
          },
          token: {
            type: 'string',
            description: 'Refresh token hash',
            example: 'hashed_refresh_token_value',
          },
          ip_address: {
            type: 'string',
            description: 'IP address of the session',
            example: '192.168.1.100',
          },
          user_agent: {
            type: 'string',
            description: 'User agent string',
            example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          expire_at: {
            type: 'string',
            format: 'date-time',
            description: 'Session expiration timestamp',
            example: '2025-10-10T10:00:00.000Z',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Session creation timestamp',
            example: '2025-10-03T10:00:00.000Z',
          },
          user_id: {
            type: 'string',
            description: 'User ID associated with the session',
            example: 'user-uuid-123',
          },
        },
      },

      // Order Response schemas
      OrderResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['order', 'message'],
            properties: {
              order: {
                $ref: '#/components/schemas/Order',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Order retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      OrdersListResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['orders', 'message'],
            properties: {
              orders: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Order',
                },
                description: 'List of orders',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Orders retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      OrderCreateResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['order', 'message'],
            properties: {
              order: {
                $ref: '#/components/schemas/Order',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Order created successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      // Product Response schemas
      ProductResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['product'],
            properties: {
              product: {
                $ref: '#/components/schemas/Product',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Product retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      ProductsListResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['products', 'pagination'],
            properties: {
              products: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Product',
                },
                description: 'List of products',
              },
              pagination: {
                type: 'object',
                required: ['page', 'limit', 'total', 'totalPages'],
                properties: {
                  page: {
                    type: 'integer',
                    description: 'Current page number',
                    example: 1,
                  },
                  limit: {
                    type: 'integer',
                    description: 'Items per page',
                    example: 10,
                  },
                  total: {
                    type: 'integer',
                    description: 'Total number of items',
                    example: 100,
                  },
                  totalPages: {
                    type: 'integer',
                    description: 'Total number of pages',
                    example: 10,
                  },
                },
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Products retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      ProductCreateResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['product', 'message'],
            properties: {
              product: {
                $ref: '#/components/schemas/Product',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Product created successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      // Wishlist schemas
      Wishlist: {
        type: 'object',
        required: ['id', 'user_id', 'items', 'created_at', 'updated_at'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique wishlist identifier',
            example: 'wishlist123',
          },
          user_id: {
            type: 'string',
            description: 'User ID associated with the wishlist',
            example: 'user123',
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/WishlistItem',
            },
            description: 'Wishlist items',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Wishlist creation timestamp',
            example: '2024-01-15T10:30:00Z',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },

      WishlistItem: {
        type: 'object',
        required: ['id', 'wishlist_id', 'product_id', 'product', 'created_at'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique wishlist item identifier',
            example: 'wishlistItem123',
          },
          wishlist_id: {
            type: 'string',
            description: 'Wishlist ID',
            example: 'wishlist123',
          },
          product_id: {
            type: 'string',
            description: 'Product ID',
            example: 'prod123',
          },
          product: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Product ID',
                example: 'prod123',
              },
              name: {
                type: 'string',
                description: 'Product name',
                example: 'Nike Air Force 1',
              },
              price: {
                type: 'number',
                format: 'float',
                description: 'Product price',
                example: 89.99,
              },
              images: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'Product images',
                example: ['https://example.com/image1.jpg'],
              },
              brand: {
                type: 'string',
                description: 'Product brand',
                example: 'Nike',
              },
              stock: {
                type: 'integer',
                description: 'Available stock',
                example: 50,
              },
            },
            description: 'Product information',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Item added timestamp',
            example: '2024-01-15T10:30:00Z',
          },
        },
      },

      // Wishlist Response schemas
      WishlistResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['wishlist', 'message'],
            properties: {
              wishlist: {
                $ref: '#/components/schemas/Wishlist',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Wishlist retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      WishlistItemResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['wishlistItem', 'message'],
            properties: {
              wishlistItem: {
                $ref: '#/components/schemas/WishlistItem',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Product added to wishlist successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      WishlistStatusResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['isInWishlist', 'message'],
            properties: {
              isInWishlist: {
                type: 'boolean',
                description: 'Whether the product is in the wishlist',
                example: true,
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Wishlist status checked successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      WishlistCountResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['count', 'message'],
            properties: {
              count: {
                type: 'integer',
                description: 'Number of items in wishlist',
                example: 5,
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Wishlist item count retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      // Payment Response schemas
      PaymentResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['payment', 'message'],
            properties: {
              payment: {
                $ref: '#/components/schemas/Payment',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Payment retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      PaymentsListResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['payments', 'message'],
            properties: {
              payments: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Payment',
                },
                description: 'List of payments',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Payments retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      PaymentCreateResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['payment', 'message'],
            properties: {
              payment: {
                $ref: '#/components/schemas/Payment',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Payment created successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      // Cart Response schemas
      CartResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['cart', 'message'],
            properties: {
              cart: {
                $ref: '#/components/schemas/Cart',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Cart retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      CartItemResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['cartItem', 'message'],
            properties: {
              cartItem: {
                $ref: '#/components/schemas/CartItem',
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Item added to cart successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
          },
        },
      },

      CartCountResponse: {
        type: 'object',
        required: ['local_date_time', 'data', 'api_error'],
        properties: {
          local_date_time: {
            type: 'string',
            format: 'date-time',
            description: 'Response timestamp',
            example: '2025-10-04T10:00:00.000Z',
          },
          data: {
            type: 'object',
            required: ['count', 'message'],
            properties: {
              count: {
                type: 'integer',
                description: 'Number of items in cart',
                example: 5,
              },
              message: {
                type: 'string',
                description: 'Success message',
                example: 'Cart item count retrieved successfully',
              },
            },
          },
          api_error: {
            type: 'null',
            example: null,
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