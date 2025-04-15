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
        // Core Schemas
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
            historique: { type: 'array', items: {} },
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
        },

        // Virement Schemas
        Virement: {
          type: 'object',
          properties: {
            fromAccount: { type: 'string', example: '613c3f1f8a0b5f00123abcde' },
            toAccount: { type: 'string', example: '07xxxxxxxx' },
            amount: { type: 'number', example: 1500 },
            description: { type: 'string', example: 'Paiement facture' },
            status: { type: 'string', example: 'Completed' }
          },
          required: ['fromAccount', 'toAccount', 'amount']
        },
        VirementGroupe: {
          type: 'object',
          properties: {
            fromAccount: { type: 'string', example: '613c3f1f8a0b5f00123abcde' },
            virements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  beneficiary: { type: 'string', example: '12345678901234567890' },
                  amount: { type: 'number', example: 500 },
                  motif: { type: 'string', example: 'Remboursement' }
                },
                required: ['beneficiary', 'amount']
              }
            }
          },
          required: ['fromAccount', 'virements']
        },
        VirementProgramme: {
          type: 'object',
          properties: {
            fromAccount: { type: 'string', example: '613c3f1f8a0b5f00123abcde' },
            toAccount: { type: 'string', example: '613c3f1f8a0b5f00123defgh' },
            amount: { type: 'number', example: 200 },
            description: { type: 'string', example: 'Abonnement mensuel' },
            frequency: { 
              type: 'string', 
              example: 'mensuel',
              enum: ['quotidien', 'hebdomadaire', 'mensuel', 'trimestriel', 'annuel']
            },
            startDate: { type: 'string', format: 'date-time', example: '2025-05-01T00:00:00.000Z' },
            endDate: { type: 'string', format: 'date-time', example: '2025-12-31T00:00:00.000Z' }
          },
          required: ['fromAccount', 'toAccount', 'amount', 'frequency', 'startDate', 'endDate']
        },

        // Video Conference Schemas
        VideoConferenceRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Alice Dupont' },
            email: { type: 'string', format: 'email', example: 'alice@example.com' },
            subject: { type: 'string', example: 'Support technique' },
            phone: { type: 'string', example: '0123456789' },
            roomId: { type: 'string', example: 'ROOM123' },
            status: { type: 'string', example: 'pending' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        VideoConferenceStatusUpdate: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['active', 'completed'], example: 'active' },
            roomId: { type: 'string', example: 'ROOM456' }
          },
          required: ['status']
        },

        // Payment Schema
        Payment: {
          type: 'object',
          properties: {
            cardId: { type: 'string', example: '613c3f1f8a0b5f00123abcd1' },
            userId: { type: 'string', example: '613c3f1f8a0b5f00123abcd2' },
            amount: { type: 'number', example: 100 },
            merchantType: { type: 'string', example: 'Retail' }
          },
          required: ['cardId', 'userId', 'amount']
        },

        // Kiosk Schema
        Kiosk: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            SN: { type: 'string', example: 'SN123456' },
            status: { type: 'string', example: 'online' },
            enabled: { type: 'boolean', example: false },
            tote: { type: 'string', example: 'TM1' },
            temperature: { type: 'number', example: 35 },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // Historique Schema (placeholder)
        Historique: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date-time' },
            amount: { type: 'number' },
            description: { type: 'string' },
            type: { type: 'string' },
            reference: { type: 'string' }
          }
        },

        // DemandeCreationCompte Schema
        DemandeCreationCompte: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nom: { type: 'string', example: 'Dupont' },
            prenom: { type: 'string', example: 'Alice' },
            dateNaissance: { type: 'string', example: '1990-01-01' },
            lieuNaissance: { type: 'string', example: 'Paris' },
            numeroCIN: { type: 'string', example: '98765432' },
            dateDelivranceCIN: { type: 'string', example: '2010-05-15' },
            lieuDelivranceCIN: { type: 'string', example: 'Lyon' },
            qualiteJuridique: { type: 'string' },
            situationFamille: { type: 'string', example: 'Célibataire' },
            email: { type: 'string', format: 'email', example: 'alice.dupont@example.com' },
            numeroGSM: { type: 'string', example: '0123456789' },
            adresseDomicile: { type: 'string', example: '10 Rue Example' },
            codePostal: { type: 'string', example: '2080' },
            ville: { type: 'string', example: 'ARIANA' },
            activite: { type: 'string', example: 'Elève/étudiant' },
            fonction: { type: 'string', example: 'Neant' },
            fatca: { type: 'string', example: 'non' },
            citoyenneteAmericaine: { type: 'string', example: 'NON' },
            pays: { type: 'string', example: 'TUN TUNISIENNE' },
            detentionCodeTIN: { type: 'string', example: 'NON' },
            codeTIN: { type: 'string' },
            ligneTelephoniqueUSA: { type: 'string', example: 'NON' },
            detentionGreenCard: { type: 'string', example: 'NON' },
            adressePostaleUSA: { type: 'string', example: 'NON' },
            virementPermanentUSA: { type: 'string', example: 'NON' },
            procurationPersonneUSA: { type: 'string', example: 'NON' },
            detentionSocieteAmericaine: { type: 'string', example: 'NON' },
            connuAmenBank: { type: 'string', example: 'Oui' },
            connuAmenBankAutre: { type: 'string' },
            exerceHauteFonction: { type: 'string', example: 'NON' },
            exerceHauteFonctionDetail: {
              type: 'object',
              properties: {
                fonction: { type: 'string' },
                organisme: { type: 'string' }
              }
            },
            liePersonneHauteFonction: { type: 'string', example: 'NON' },
            liePersonneHauteFonctionDetail: {
              type: 'object',
              properties: {
                fonction: { type: 'string' },
                organisme: { type: 'string' },
                nomPrenom: { type: 'string' }
              }
            },
            fonctionnaireOrganisationInternationale: { type: 'string', example: 'NON' },
            fonctionnaireOrganisationInternationaleDetail: {
              type: 'object',
              properties: {
                fonction: { type: 'string' },
                organisme: { type: 'string' }
              }
            },
            revenusTypes: {
              type: 'object',
              properties: {
                salaires: { type: 'boolean', example: false },
                honoraires: { type: 'boolean', example: false },
                loyers: { type: 'boolean', example: false },
                pensions: { type: 'boolean', example: false },
                revenusAvoirs: { type: 'boolean', example: false },
                autres: { type: 'boolean', example: false }
              }
            },
            montantRevenusAnnuels: { type: 'string' },
            montantRevenusMensuels: { type: 'string' },
            objetOuvertureCompte: {
              type: 'object',
              properties: {
                domiciliationSalaires: { type: 'boolean', example: false },
                placements: { type: 'boolean', example: false },
                investissementsMarchesFinanciers: { type: 'boolean', example: false },
                credits: { type: 'boolean', example: false },
                activiteCommerciale: { type: 'boolean', example: false },
                autre: { type: 'boolean', example: false }
              }
            },
            objetOuvertureCompteAutre: { type: 'string' },
            transactionsEnvisagees: {
              type: 'object',
              properties: {
                operationsCourantes: { type: 'boolean', example: false },
                transfertsCommerciaux: { type: 'boolean', example: false },
                transfertsFinanciers: { type: 'boolean', example: false },
                epargneDepot: { type: 'boolean', example: false },
                credits: { type: 'boolean', example: false },
                titres: { type: 'boolean', example: false }
              }
            },
            volumeMensuelTransaction: { type: 'string' },
            typeCompte: { type: 'string', example: 'Compte courant' },
            agenceContact: { type: 'string', example: 'Agence Centrale' },
            acceptConditions: { type: 'boolean', example: true },
            wantCreditCard: { type: 'boolean', example: true },
            creditCardType: { type: 'string', example: 'Visa' },
            documentsValides: { type: 'boolean', example: true },
            cinRecto: { type: 'string' },
            cinVerso: { type: 'string' },
            specimenSignature: { type: 'string' },
            ficheProfilClient: { type: 'string' },
            selfiAvecCIN: { type: 'string' },
            captcha: { type: 'string' },
            status: { type: 'string', example: 'pending' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },

        // Admin Schema
        Admin: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Admin User' },
            cin: { type: 'string', example: '11223344' },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', example: 'hashed_password' },
            role: { type: 'string', example: 'admin' },
            department: { type: 'string', example: 'General' },
            permissions: {
              type: 'array',
              items: { type: 'string' },
              example: ['manage_users', 'manage_accounts']
            },
            otp: {
              type: 'object',
              properties: {
                hash: { type: 'string', example: 'hashed_otp' },
                expires: { type: 'string', format: 'date-time' }
              }
            },
            resetPasswordToken: { type: 'string' },
            resetPasswordExpires: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Endpoints for user authentication' },
      { name: 'User', description: 'Endpoints for user operations' },
      { name: 'Compte', description: 'Endpoints for account management' },
      { name: 'Carte', description: 'Endpoints for card management' },
      { name: 'Transactions', description: 'Endpoints for credit card transactions' },
      { name: 'Password', description: 'Endpoints for password recovery' },
      { name: 'Virement', description: 'Endpoints for single virement operations' },
      { name: 'Virement Groupe', description: 'Endpoints for group transfers' },
      { name: 'Virement Programme', description: 'Endpoints for scheduled transfers' },
      { name: 'Video Conference', description: 'Endpoints for video conference requests' },
      { name: 'Payment', description: 'Endpoints for payment processing' },
      { name: 'Kiosk', description: 'Endpoints for kiosk management' },
      { name: 'Historique', description: 'Endpoints for transaction history' },
      { name: 'Demandes', description: 'Endpoints for account creation requests' },
      { name: 'Admin', description: 'Endpoints for admin authentication and management' }
    ],
    paths: {
      // ========================= Existing Endpoints (Auth, User, etc.) =========================
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
            '201': { description: 'User registered and comptes created successfully' },
            '400': { description: 'User already exists or invalid request' },
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
            '200': { description: 'OTP sent successfully' },
            '400': { description: 'Invalid credentials' },
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
            '200': { description: 'OTP verified successfully' },
            '400': { description: 'Invalid or expired OTP' },
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
            '200': { description: 'New OTP sent successfully' },
            '400': { description: 'User not found or invalid request' },
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
            '200': { description: 'User profile retrieved successfully' },
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
            '200': { description: 'Logged out successfully' },
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
            '201': { description: 'Compte added successfully' },
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
            '200': { description: 'Reset password link sent successfully' },
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
            '200': { description: 'Password reset successfully' },
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
            '201': { description: 'Carte added successfully' },
            '404': { description: 'Compte not found' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/beneficiaires': {
        get: {
          tags: ['Beneficiaires'],
          summary: 'Get user beneficiaries',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'List of beneficiaries' }
          }
        },
        post: {
          tags: ['Beneficiaires'],
          summary: 'Create new beneficiary',
          security: [{ bearerAuth: [] }],
          responses: {
            '201': { description: 'Beneficiary created' }
          }
        }
      },
      '/api/beneficiaires/{id}': {
        put: {
          tags: ['Beneficiaires'],
          summary: 'Update beneficiary',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Updated beneficiary' }
          }
        },
        delete: {
          tags: ['Beneficiaires'],
          summary: 'Delete beneficiary',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Beneficiary deleted' }
          }
        }
      },
      '/api/budget/categories': {
        get: {
          tags: ['Budget'],
          summary: 'Get budget categories',
          parameters: [{
            name: 'userId',
            in: 'query',
            required: true,
            schema: { type: 'string' }
          }],
          responses: {
            '200': { description: 'List of categories' }
          }
        },
        post: {
          tags: ['Budget'],
          summary: 'Create budget category',
          responses: {
            '201': { description: 'Category created' }
          }
        }
      },
      '/api/payment/qr': {
        post: {
          tags: ['Payment'],
          summary: 'Process QR payment',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Payment processed' }
          }
        }
      },
      '/api/chat': {
        post: {
          tags: ['Chat'],
          summary: 'Chat with banking assistant',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Chat response' }
          }
        }
      },

      // ========================= New Virement Endpoints =========================
      '/api/virement': {
        post: {
          tags: ['Virement'],
          summary: 'Créer un virement',
          description: 'Effectue un virement entre comptes avec traitement immédiat ou programmé selon les règles métier.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Virement' }
              }
            }
          },
          responses: {
            '201': { description: 'Virement créé avec succès' },
            '400': { description: 'Informations manquantes ou fonds insuffisants' },
            '404': { description: "Compte de l'expéditeur introuvable" },
            '500': { description: 'Erreur serveur' }
          }
        }
      },
      '/api/virement-groupe': {
        post: {
          tags: ['Virement Groupe'],
          summary: 'Créer un virement groupé',
          description: 'Effectue plusieurs virements depuis un seul compte source vers différents bénéficiaires.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VirementGroupe' }
              }
            }
          },
          responses: {
            '201': { description: 'Virements groupés effectués avec succès' },
            '400': { description: 'Données de virement invalide ou fonds insuffisants' },
            '404': { description: 'Compte source introuvable' },
            '500': { description: 'Erreur serveur' }
          }
        }
      },
      '/api/virement-programme': {
        post: {
          tags: ['Virement Programme'],
          summary: 'Créer un virement programmé',
          description: 'Planifie un virement récurrent selon une fréquence définie entre deux dates.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VirementProgramme' }
              }
            }
          },
          responses: {
            '201': { description: 'Virement programmé créé et planifié' },
            '400': { description: 'Données invalides, fonds insuffisants ou dates incorrectes' },
            '404': { description: 'Compte source introuvable' },
            '500': { description: 'Erreur serveur' }
          }
        }
      },

      // ========================= New Kiosk Endpoints =========================
      '/api/kiosks': {
        get: {
          tags: ['Kiosk'],
          summary: 'Get all kiosks',
          responses: {
            '200': { description: 'List of kiosks' }
          }
        },
        post: {
          tags: ['Kiosk'],
          summary: 'Create a new kiosk',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Kiosk' }
              }
            }
          },
          responses: {
            '201': { description: 'Kiosk created successfully' }
          }
        }
      },
      '/api/kiosks/{id}': {
        get: {
          tags: ['Kiosk'],
          summary: 'Get kiosk by ID',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          responses: {
            '200': { description: 'Kiosk found' },
            '404': { description: 'Kiosk not found' }
          }
        },
        put: {
          tags: ['Kiosk'],
          summary: 'Update an existing kiosk',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/Kiosk' } }
            }
          },
          responses: {
            '200': { description: 'Kiosk updated successfully' },
            '404': { description: 'Kiosk not found' }
          }
        },
        delete: {
          tags: ['Kiosk'],
          summary: 'Delete a kiosk',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          responses: {
            '200': { description: 'Kiosk deleted successfully' },
            '404': { description: 'Kiosk not found' }
          }
        }
      },
      '/api/kiosks/pending': {
        get: {
          tags: ['Kiosk'],
          summary: 'Get pending kiosks (not enabled)',
          responses: {
            '200': { description: 'List of pending kiosks' }
          }
        }
      },
      '/api/kiosks/approve': {
        post: {
          tags: ['Kiosk'],
          summary: 'Approve a kiosk',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    kioskId: { type: 'string', example: '613c3f1f8a0b5f00123kiosk' }
                  },
                  required: ['kioskId']
                }
              }
            }
          },
          responses: {
            '200': { description: 'Kiosk approved successfully' },
            '400': { description: 'Kiosk ID required or approval failed' },
            '404': { description: 'Kiosk not found' }
          }
        }
      },
      '/api/kiosk/shutdown': {
        post: {
          tags: ['Kiosk'],
          summary: 'Shutdown a kiosk',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totemId: { type: 'string', example: 'TOTEM123' }
                  },
                  required: ['totemId']
                }
              }
            }
          },
          responses: {
            '200': { description: 'Shutdown command sent successfully' },
            '400': { description: 'Totem ID missing or kiosk already offline' },
            '404': { description: 'Kiosk not found' }
          }
        }
      },
      '/api/kiosk/restart': {
        post: {
          tags: ['Kiosk'],
          summary: 'Restart a kiosk',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totemId: { type: 'string', example: 'TOTEM123' }
                  },
                  required: ['totemId']
                }
              }
            }
          },
          responses: {
            '200': { description: 'Restart command sent successfully' },
            '400': { description: 'Totem ID missing or kiosk not online' },
            '404': { description: 'Kiosk not found' }
          }
        }
      },
      '/api/kiosks/reject': {
        post: {
          tags: ['Kiosk'],
          summary: 'Reject a kiosk',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    kioskId: { type: 'string', example: '613c3f1f8a0b5f00123kiosk' }
                  },
                  required: ['kioskId']
                }
              }
            }
          },
          responses: {
            '200': { description: 'Kiosk rejected and removed' },
            '400': { description: 'Kiosk ID required' },
            '404': { description: 'Kiosk not found' }
          }
        }
      },
      '/api/kiosks/diagnostic': {
        post: {
          tags: ['Kiosk'],
          summary: 'Run diagnostic on a kiosk',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totemId: { type: 'string', example: 'SN123456' }
                  },
                  required: ['totemId']
                }
              }
            }
          },
          responses: {
            '200': { description: 'Diagnostic command sent successfully' },
            '400': { description: 'Totem ID required' },
            '404': { description: 'Kiosk not found' }
          }
        }
      },

      // ========================= New Video Conference Endpoints =========================
      '/api/video-conference': {
        get: {
          tags: ['Video Conference'],
          summary: 'Retrieve all video conference requests',
          responses: {
            '200': { description: 'List of video conference requests' }
          }
        },
        post: {
          tags: ['Video Conference'],
          summary: 'Create a video conference request',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VideoConferenceRequest' }
              }
            }
          },
          responses: {
            '201': { description: 'Video conference request created successfully' },
            '400': { description: 'Required fields missing or invalid.' },
            '500': { description: 'Server error.' }
          }
        }
      },
      '/api/video-conference/{id}': {
        put: {
          tags: ['Video Conference'],
          summary: 'Update video conference request status',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/VideoConferenceStatusUpdate' }
              }
            }
          },
          responses: {
            '200': { description: 'Status updated successfully' },
            '400': { description: 'Invalid status provided.' },
            '404': { description: 'Video conference request not found.' },
            '500': { description: 'Server error.' }
          }
        },
        delete: {
          tags: ['Video Conference'],
          summary: 'Delete a video conference request',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          responses: {
            '200': { description: 'Video conference request deleted successfully' },
            '404': { description: 'Video conference request not found' },
            '500': { description: 'Server error' }
          }
        }
      },

      // ========================= New Payment Endpoint (Non-QR) =========================
      '/api/payment': {
        post: {
          tags: ['Payment'],
          summary: 'Process a payment',
          description: 'Deducts the amount from the payer account and credits the receiver account.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Payment' }
              }
            }
          },
          responses: {
            '200': { description: 'Payment processed and recorded successfully.' },
            '400': { description: 'Missing required fields or insufficient funds.' },
            '404': { description: 'Card or account not found.' },
            '500': { description: 'Server error during payment processing.' }
          }
        }
      },

      // ========================= New Historique Endpoint =========================
      '/api/historique': {
        get: {
          tags: ['Historique'],
          summary: 'Get transaction history for a user',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
          ],
          responses: {
            '200': { description: 'Transaction history retrieved successfully.' },
            '500': { description: 'Server error' }
          }
        }
      },

      // ========================= New Chat Endpoint =========================
      '/api/chat': {
        post: {
          tags: ['Chat'],
          summary: 'Chat with banking assistant',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          responses: {
            '200': { description: 'Chat response' }
          }
        }
      },

      // ========================= New DemandeCreationCompte Endpoints =========================
      '/api/demandes': {
        post: {
          tags: ['Demandes'],
          summary: 'Create a new account creation request',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DemandeCreationCompte' }
              }
            }
          },
          responses: {
            '201': { description: 'Demande de création de compte enregistrée avec succès' },
            '500': { description: 'Erreur lors de l\'enregistrement de la demande' }
          }
        },
        get: {
          tags: ['Demandes'],
          summary: 'Retrieve all account creation requests',
          responses: {
            '200': { description: 'List of demandes' },
            '500': { description: 'Erreur lors de la récupération des demandes' }
          }
        }
      },
      '/api/demandes/{id}/approve': {
        put: {
          tags: ['Demandes'],
          summary: 'Approve an account creation request',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          responses: {
            '200': { description: 'Demande approuvée; utilisateur, compte et carte créés, email envoyé' },
            '404': { description: 'Demande non trouvée' },
            '500': { description: 'Erreur lors de l\'approbation de la demande' }
          }
        }
      },
      '/api/demandes/{id}/reject': {
        delete: {
          tags: ['Demandes'],
          summary: 'Reject an account creation request and send email',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          responses: {
            '200': { description: 'Demande supprimée et email envoyé avec succès' },
            '404': { description: 'Demande non trouvée' },
            '500': { description: 'Erreur lors du rejet de la demande' }
          }
        }
      },

      // ========================= New Admin Authentication Endpoints =========================
      '/api/admin/register': {
        post: {
          tags: ['Admin'],
          summary: 'Register a new admin',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Admin' }
              }
            }
          },
          responses: {
            '201': { description: 'Admin registered successfully' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/admin/update/{id}': {
        put: {
          tags: ['Admin'],
          summary: 'Update an existing admin',
          parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Admin' }
              }
            }
          },
          responses: {
            '200': { description: 'Admin updated successfully' },
            '404': { description: 'Admin not found' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/admin/login': {
        post: {
          tags: ['Admin'],
          summary: 'Admin login and send OTP',
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
            '200': { description: 'OTP sent for admin verification' },
            '401': { description: 'Invalid credentials' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/admin/verify-otp': {
        post: {
          tags: ['Admin'],
          summary: 'Verify admin OTP and generate JWT token',
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
            '200': { description: 'OTP verified successfully. Admin logged in.' },
            '400': { description: 'OTP invalid or expired' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/admin/resend-otp': {
        post: {
          tags: ['Admin'],
          summary: 'Resend a new OTP to the admin',
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
            '200': { description: 'New OTP sent successfully' },
            '400': { description: 'Admin not found' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/admin/forgot-password': {
        post: {
          tags: ['Admin'],
          summary: 'Initiate password reset for admin',
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
            '200': { description: 'If the email exists, a reset link has been sent' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/admin/reset-password': {
        post: {
          tags: ['Admin'],
          summary: 'Reset admin password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', format: 'email' },
                    token: { type: 'string' },
                    newPassword: { type: 'string', format: 'password' }
                  },
                  required: ['email', 'token', 'newPassword']
                }
              }
            }
          },
          responses: {
            '200': { description: 'Password has been reset successfully.' },
            '400': { description: 'Invalid or expired reset token.' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/admin/profile': {
        get: {
          tags: ['Admin'],
          summary: 'Retrieve admin profile',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Admin profile retrieved successfully.' },
            '404': { description: 'Admin not found.' },
            '500': { description: 'Server error.' }
          }
        }
      },
      '/api/admin/logout': {
        post: {
          tags: ['Admin'],
          summary: 'Admin logout',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Admin logged out successfully.' },
            '500': { description: 'Server error.' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;
