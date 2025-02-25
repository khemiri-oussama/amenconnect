// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AmenConnect API Documentation',
      version: '1.0.0',
      description: 'API documentation for the AmenConnect banking application',
      contact: {
        name: 'API Support',
        email: 'amenconnect1@gmail.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.amenconnect.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            cin: { type: 'string', example: '12345678' },
            nom: { type: 'string', example: 'Doe' },
            prenom: { type: 'string', example: 'John' },
            email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
            telephone: { type: 'string', example: '0123456789' },
            employeur: { type: 'string', example: 'Company Inc' },
            adresseEmployeur: { type: 'string', example: '123 Main Street' },
            compteIds: {
              type: 'array',
              items: { type: 'string' }
            },
            carteIds: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        Compte: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            numéroCompte: { type: 'string', example: '12345678901' },
            solde: { type: 'number', example: 0.0 },
            type: { type: 'string', example: 'Compte courant' },
            avecChéquier: { type: 'boolean', example: true },
            avecCarteBancaire: { type: 'boolean', example: true },
            modalitésRetrait: { type: 'string', example: '2000' },
            conditionsGel: { type: 'string', example: 'Aucune restriction' },
            historique: {
              type: 'array',
              items: {}
            },
            RIB: { type: 'string', example: '12345678901234567890' },
            IBAN: { type: 'string', example: 'TN5912345678901234567890' },
            domiciliation: { type: 'string', example: 'AMEN BANK - Agence Centrale' }
          }
        },
        Carte: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            CardNumber: { type: 'string', example: '1234567812345678' },
            ExpiryDate: { type: 'string', example: '12/29' },
            CardHolder: { type: 'string', example: 'John Doe' },
            CreatedAt: { type: 'string', example: '2025-02-25T10:00:00.000Z' },
            UpdatedAt: { type: 'string', example: '2025-02-25T10:00:00.000Z' },
            comptesId: { type: 'string' },
            TypeCarte: { type: 'string', example: 'debit' },
            monthlyExpenses: {
              type: 'object',
              properties: {
                current: { type: 'number', example: 0 },
                limit: { type: 'number', example: 5000000 }
              }
            },
            atmWithdrawal: {
              type: 'object',
              properties: {
                current: { type: 'number', example: 0 },
                limit: { type: 'number', example: 1000000 }
              }
            },
            pendingTransactions: {
              type: 'object',
              properties: {
                amount: { type: 'number', example: 0 },
                count: { type: 'number', example: 3 }
              }
            },
            cardStatus: { type: 'string', example: 'Active' }
          }
        },
        CreditCardTransaction: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            amount: { type: 'number', example: 100.0 },
            transactionDate: {
              type: 'string',
              format: 'date-time',
              example: '2025-02-25T12:00:00.000Z'
            },
            description: { type: 'string', example: 'Purchase at store' },
            carteId: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Auth', description: 'Endpoints for user authentication' },
      { name: 'User', description: 'Endpoints for user operations' },
      { name: 'Compte', description: 'Endpoints for account management' },
      { name: 'Carte', description: 'Endpoints for card management' },
      { name: 'Transactions', description: 'Endpoints for credit card transactions' },
      { name: 'Password', description: 'Endpoints for password recovery' },
      { name: 'IP', description: 'Endpoints for IP related operations' }
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user and create accounts',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    cin: { type: 'string' },
                    nom: { type: 'string' },
                    prenom: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    telephone: { type: 'string' },
                    employeur: { type: 'string' },
                    adresseEmployeur: { type: 'string' },
                    password: { type: 'string', format: 'password' },
                    comptes: {
                      type: 'array',
                      items: { type: 'string' },
                      description: "Array of compte types e.g. ['Compte courant', 'Compte épargne']"
                    }
                  },
                  required: ['cin', 'nom', 'prenom', 'email', 'telephone', 'employeur', 'adresseEmployeur', 'password']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'User registered and comptes created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' }
                    }
                  }
                }
              }
            },
            '400': {
              description: 'User already exists or invalid request',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Authenticate user and send OTP',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' }
                  },
                  required: ['email', 'password']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'OTP sent successfully',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '400': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/auth/verify-otp': {
        post: {
          tags: ['Auth'],
          summary: 'Verify the OTP provided by the user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    otp: { type: 'string' }
                  },
                  required: ['email', 'otp']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'OTP verified successfully',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '400': {
              description: 'Invalid or expired OTP',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/auth/resend-otp': {
        post: {
          tags: ['Auth'],
          summary: 'Resend a new OTP to the user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' }
                  },
                  required: ['email']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'New OTP sent successfully',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '400': {
              description: 'User not found or invalid request',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/auth/profile': {
        get: {
          tags: ['User'],
          summary: 'Get full user profile along with comptes and cartes',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'User profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user: { $ref: '#/components/schemas/User' },
                      comptes: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Compte' }
                      },
                      cartes: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Carte' }
                      }
                    }
                  }
                }
              }
            },
            '404': { description: 'User not found' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout the user by clearing the token',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Logged out successfully',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/auth/addCompte': {
        post: {
          tags: ['Compte'],
          summary: 'Add a new compte for a user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    type: { type: 'string', example: 'Compte courant' }
                  },
                  required: ['userId', 'type']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Compte added successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      compte: { $ref: '#/components/schemas/Compte' }
                    }
                  }
                }
              }
            },
            '400': { description: 'User not found or compte already exists' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/password/forgot-password': {
        post: {
          tags: ['Password'],
          summary: "Send a reset password link to the user's email",
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    cin: { type: 'string', example: '12345678' }
                  },
                  required: ['cin']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Reset password link sent successfully',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '404': { description: 'User not found' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/password/reset-password': {
        post: {
          tags: ['Password'],
          summary: "Reset the user's password",
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    newPassword: { type: 'string', format: 'password' }
                  },
                  required: ['token', 'newPassword']
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Password reset successfully',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { message: { type: 'string' } } }
                }
              }
            },
            '400': { description: 'Invalid or expired token' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/carte/addCarte': {
        post: {
          tags: ['Carte'],
          summary: 'Add a new carte to a compte',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    comptesId: { type: 'string' },
                    CardHolder: { type: 'string' },
                    TypeCarte: { type: 'string' }
                  },
                  required: ['comptesId', 'CardHolder']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Carte added successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                      carte: { $ref: '#/components/schemas/Carte' }
                    }
                  }
                }
              }
            },
            '404': { description: 'Compte not found' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/ip': {
        get: {
          tags: ['IP'],
          summary: 'Example endpoint for IP related operations',
          responses: {
            '200': {
              description: 'IP endpoint response',
              content: {
                'application/json': {
                  schema: { type: 'object', properties: { ip: { type: 'string', example: '127.0.0.1' } } }
                }
              }
            },
            '500': { description: 'Server error' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Optionally include your route annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
