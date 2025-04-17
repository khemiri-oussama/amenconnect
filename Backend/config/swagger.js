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
        // Updated User Schema
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        cin: { type: 'string', example: '12345678' },
        nom: { type: 'string', example: 'Doe' },
        prenom: { type: 'string', example: 'John' },
        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
        compteIds: {
          type: 'array',
          items: { type: 'string' }
        },
        otp: {
          type: 'object',
          properties: {
            hash: { type: 'string' },
            expires: { type: 'string', format: 'date-time' }
          }
        },
        resetPasswordToken: {
          type: 'object',
          properties: {
            hash: { type: 'string' },
            expires: { type: 'string', format: 'date-time' }
          }
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
            subject: { type: 'string', example: 'Account Support' },
            phone: { type: 'string', example: '+21620123456' },
            roomId: { type: 'string', example: 'ROOM-123' },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              example: 'pending'
            },
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
            version: { type: 'string', example: '1.2.3' },
            temperature: { type: 'number', example: 35 },
            location: { type: 'string', example: 'Agence Centrale' },
            agencyName: { type: 'string', example: 'Main Branch' },
            enabled: { type: 'boolean', example: false },
            last_heartbeat: { type: 'number', example: 1717027200 },
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
        },
        // Theme Preset Schema
    ThemePreset: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Corporate Blue' },
        theme: {
          type: 'object',
          properties: {
            kioskPrimary: { type: 'string', example: '#123456' },
            kioskPrimaryDark: { type: 'string', example: '#0a2b3c' },
            kioskAccent: { type: 'string', example: '#ff5722' },
            // Include all theme properties from the model
          }
        },
        isDefault: { type: 'boolean', example: false }
      }
    },
        ThemeSetting: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            css: { type: 'string', example: ':root { --primary-color: #123456; }' }
          }
        },
        Incident: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            totemId: { type: 'string', example: 'TOTEM123' },
            type: { 
              type: 'string',
              enum: ['Hardware Failure', 'Software Error', 'Other'],
              example: 'Hardware Failure'
            },
            description: { type: 'string', example: 'Screen not responding' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
    
        // Admin Schema (updated)
        Admin: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', example: 'Admin User' },
            cin: { type: 'string', example: '11223344' },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            role: { 
              type: 'string',
              enum: ['admin', 'superadmin', 'manager'],
              example: 'admin'
            },
            department: { type: 'string', example: 'Technical Support' },
            permissions: {
              type: 'array',
              items: { type: 'string' },
              example: ['user_management', 'system_config']
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
    
        // Admin Alert Schema
        AdminAlert: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            type: { type: 'string', example: 'Security' },
            message: { type: 'string', example: 'Suspicious login attempt detected' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
    
        // Beneficiaire Schema
        Beneficiaire: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            nom: { type: 'string', example: 'Dupont' },
            prenom: { type: 'string', example: 'Marie' },
            RIB: { type: 'string', example: 'TN5901234567890123456789' },
            banque: { type: 'string', example: 'Amen Bank' },
            email: { type: 'string', format: 'email', example: 'marie.dupont@example.com' },
            telephone: { type: 'string', example: '+21620123456' },
            dateAjout: { type: 'string', format: 'date-time' }
          }
        },
    
        // Budget Category Schema
        BudgetCategory: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string', example: 'Groceries' },
            limit: { type: 'number', example: 1000 },
            color: { type: 'string', example: '#FF5733' },
            current: { type: 'number', example: 450 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
    
        // Credit Card Transaction Schema
        CreditCardTransaction: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            amount: { type: 'number', example: 150.5 },
            transactionDate: { type: 'string', format: 'date-time' },
            description: { type: 'string', example: 'Supermarket purchase' },
            currency: { type: 'string', example: 'TND' },
            merchant: { type: 'string', example: 'Carrefour' },
            status: { type: 'string', example: 'completed' },
            carteId: { type: 'string' }
          }
        },
    
        // DemandeCreationCompte Schema (expanded)
        DemandeCreationCompte: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nom: { type: 'string', example: 'Ben Ali' },
            prenom: { type: 'string', example: 'Mohamed' },
            numeroCIN: { type: 'string', example: '98765432' },
            email: { type: 'string', format: 'email', example: 'mohamed.benali@example.com' },
            status: { type: 'string', example: 'pending' },
            createdAt: { type: 'string', format: 'date-time' },
            // Include other fields as needed following the model structure
          }
        },
        LoginAttempt: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string', example: 'user@example.com' },
            ipAddress: { type: 'string', example: '192.168.1.1' },
            userAgent: { type: 'string', example: 'Chrome/120.0.0.0' },
            success: { type: 'boolean', example: false },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        // QR Session Schema
    QRSession: {
      type: 'object',
      properties: {
        sessionId: { type: 'string', example: 'qr-session-123' },
        status: { 
          type: 'string',
          enum: ['pending', 'authenticated'],
          example: 'pending'
        },
        user: { $ref: '#/components/schemas/User' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    },
    // User Session Schema
    Session: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        userId: { type: 'string' },
        sessionId: { type: 'string', example: 'session-123' },
        device: { type: 'string', example: 'iPhone 15' },
        ipAddress: { type: 'string', example: '192.168.1.100' },
        lastActive: { type: 'string', format: 'date-time' }
      }
    },
    TwoFactorConfig: {
      type: 'object',
      properties: {
        is2FAEnabled: { type: 'boolean', example: true },
        smsEnabled: { type: 'boolean', example: false },
        emailEnabled: { type: 'boolean', example: true },
        googleAuthEnabled: { type: 'boolean', example: false },
        googleAuthSecret: { type: 'string' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    },
    ChatRequest: {
      type: 'object',
      properties: {
        message: { type: 'string', example: "Quel est mon solde actuel?" },
        user: { $ref: '#/components/schemas/User' }
      },
      required: ['message']
    },
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
      { name: 'Admin', description: 'Endpoints for admin authentication and management' },
      { name: 'Theme', description: 'Endpoints for theme presets and settings' },
      { name: 'Budget', description: 'Endpoints for budget management' },
      { name: '2FA', description: 'Two-factor authentication management' },
      { name: 'Admin Notifications', description: 'Endpoints for admin notifications' },
      { name: 'Alerts', description: 'System alert monitoring' },
      { name: 'Incidents', description: 'System incident tracking' },
      { name: 'Admin Management', description: 'Admin user management' },
      { name: 'Beneficiaries', description: 'Beneficiary management' },
      { name: 'Chat', description: 'AI banking assistant chat' },
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
          security: [{ bearerAuth: [] }, { cookieAuth: [] }],
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
      '/api/payments/qr': {
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
      '/api/payments': {
        post: {
          tags: ['Payment'],
          summary: 'Process a payment',
          description: 'Deducts the amount from the payer account and credits the receiver account.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Payments' }
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
      },
      // Theme Preset Endpoints
      '/api/themes/presets': {
        get: {
          tags: ['Theme'],
          summary: 'Get all theme presets',
          responses: {
            '200': { description: 'List of theme presets returned successfully' },
            '500': { description: 'Server error' }
          }
        },
        post: {
          tags: ['Theme'],
          summary: 'Add a new custom theme preset',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    theme: { type: 'object', description: 'CSS variables object' }
                  },
                  required: ['name', 'theme']
                }
              }
            }
          },
          responses: {
            '201': { description: 'Theme preset created successfully' },
            '400': { description: 'Invalid input' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/themes/presets/{id}': {
        put: {
          tags: ['Theme'],
          summary: 'Update a theme preset name',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] }
              }
            }
          },
          responses: {
            '200': { description: 'Theme preset updated successfully' },
            '404': { description: 'Preset not found' },
            '500': { description: 'Server error' }
          }
        },
        delete: {
          tags: ['Theme'],
          summary: 'Delete a custom theme preset',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': { description: 'Preset deleted successfully' },
            '404': { description: 'Preset not found' },
            '500': { description: 'Server error' }
          }
        }
      },
      // Theme Variable Endpoints
      '/api/themes/variables': {
        get: {
          tags: ['Theme'],
          summary: 'Get current theme CSS variables',
          responses: {
            '200': { description: 'Theme variables retrieved successfully' },
            '404': { description: 'No theme settings found' },
            '500': { description: 'Server error' }
          }
        },
        put: {
          tags: ['Theme'],
          summary: 'Update theme CSS variables',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { type: 'object', properties: { css: { type: 'string' } }, required: ['css'] }
              }
            }
          },
          responses: {
            '200': { description: 'Theme settings updated successfully' },
            '400': { description: 'CSS content is required' },
            '500': { description: 'Server error' }
          }
        }
      },
      '/api/categories': {
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
      '200': { description: 'List of categories' },
      '500': { description: 'Server error' }
    }
  },
  post: {
    tags: ['Budget'],
    summary: 'Create budget category',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              budgetLimit: { type: 'number' }
            }
          }
        }
      }
    },
    responses: {
      '201': { description: 'Category created' },
      '400': { description: 'Invalid input' }
    }
  }
},
'/api/categories/updateBudget': {
  put: {
    tags: ['Budget'],
    summary: 'Update category budget',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              categoryId: { type: 'string' },
              newBudget: { type: 'number' }
            }
          }
        }
      }
    },
    responses: {
      '200': { description: 'Budget updated' },
      '404': { description: 'Category not found' }
    }
  }
},
'/api/2fa': {
  get: {
    tags: ['2FA'],
    summary: 'Get 2FA configuration',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': { description: '2FA config retrieved' },
      '500': { description: 'Server error' }
    }
  },
  put: {
    tags: ['2FA'],
    summary: 'Update 2FA settings',
    security: [{ bearerAuth: [] }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              is2FAEnabled: { type: 'boolean' },
              smsEnabled: { type: 'boolean' },
              emailEnabled: { type: 'boolean' },
              googleAuthEnabled: { type: 'boolean' }
            }
          }
        }
      }
    },
    responses: {
      '200': { description: '2FA settings updated' },
      '400': { description: 'Invalid input' }
    }
  }
},
'/api/demandes': {
  post: {
    tags: ['Demandes'],
    summary: 'Create account creation request',
    requestBody: {
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/DemandeCreationCompte' }
        }
      }
    },
    responses: {
      '201': { description: 'Request created' },
      '500': { description: 'Server error' }
    }
  },
  get: {
    tags: ['Demandes'],
    summary: 'Get all account requests',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': { description: 'List of requests' },
      '403': { description: 'Unauthorized' }
    }
  }
},
'/api/demandes/{id}/approve': {
  post: {
    tags: ['Demandes'],
    summary: 'Approve account request',
    security: [{ bearerAuth: [] }],
    parameters: [{
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' }
    }],
    responses: {
      '200': { description: 'Request approved' },
      '404': { description: 'Request not found' }
    }
  }
},
'/api/demandes/{id}/reject': {
  post: {
    tags: ['Demandes'],
    summary: 'Reject account request',
    security: [{ bearerAuth: [] }],
    parameters: [{
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' }
    }],
    responses: {
      '200': { description: 'Request rejected' },
      '404': { description: 'Request not found' }
    }
  }
},
'/api/admin/list': {
  get: {
    tags: ['Admin'],
    summary: 'List all admins',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': { description: 'Admin list retrieved' },
      '403': { description: 'Unauthorized' }
    }
  },
  delete: {
    tags: ['Admin'],
    summary: 'Delete admin',
    security: [{ bearerAuth: [] }],
    parameters: [{
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' }
    }],
    responses: {
      '200': { description: 'Admin deleted' },
      '400': { description: 'Cannot delete self' }
    }
  }
},
'/api/admin/notifications': {
  get: {
    tags: ['Admin Notifications'],
    summary: 'Get notifications',
    responses: {
      '200': { description: 'Notifications list' },
      '500': { description: 'Server error' }
    }
  },
  post: {
    tags: ['Admin Notifications'],
    summary: 'Create notification',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              message: { type: 'string' }
            }
          }
        }
      }
    },
    responses: {
      '201': { description: 'Notification created' }
    }
  }
},
'/api/alerts': {
  get: {
    tags: ['Alerts'],
    summary: 'Get system alerts',
    responses: {
      '200': { description: 'Recent alerts' },
      '500': { description: 'Server error' }
    }
  }
},
'/api/incidents': {
    get: {
      tags: ['Incidents'],
      summary: 'Get system incidents',
      responses: {
        '200': {
          description: 'List of incidents',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Incident' }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Incidents'],
      summary: 'Report new incident',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Incident' }
          }
        }
      },
      responses: {
        '201': { description: 'Incident reported successfully' }
      }
    }
  },

  '/api/admin/list': {
    get: {
      tags: ['Admin Management'],
      summary: 'List all admins',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Admin list',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Admin' }
              }
            }
          }
        }
      }
    }
  },

  '/api/beneficiaires': {
    get: {
      tags: ['Beneficiaries'],
      summary: 'Get user beneficiaries',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Beneficiary list',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Beneficiaire' }
              }
            }
          }
        }
      }
    }
  },
  '/api/sessions': {
    get: {
      tags: ['Sessions'],
      summary: 'Get user sessions',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'List of sessions',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Session' }
              }
            }
          }
        }
      }
    }
  },
  '/api/theme/presets': {
    post: {
      tags: ['Theme'],
      summary: 'Create theme preset',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ThemePreset' }
          }
        }
      },
      responses: {
        '201': { description: 'Theme preset created' }
      }
    }
  },
  '/api/qr-login': {
    post: {
      tags: ['Auth'],
      summary: 'Initiate QR login session',
      responses: {
        '201': {
          description: 'QR session created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/QRSession' }
            }
          }
        }
      }
    }
  },
  '/api/chat': {
    post: {
      tags: ['Chat'],
      summary: 'Chat with banking assistant',
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ChatRequest' }
          }
        }
      },
      responses: {
        '200': { 
          description: 'Chat response',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  response: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;
