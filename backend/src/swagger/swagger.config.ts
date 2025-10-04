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