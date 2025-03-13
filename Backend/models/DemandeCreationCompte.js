// models/DemandeCreationCompte.js
const mongoose = require('mongoose');

const demandeCreationSchema = new mongoose.Schema({
  // Page 1 - Personal Information
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: String, required: true },
  lieuNaissance: { type: String, required: true },
  numeroCIN: { type: String, required: true },
  dateDelivranceCIN: { type: String, required: true },
  lieuDelivranceCIN: { type: String, required: true },
  qualiteJuridique: { type: String },
  situationFamille: { type: String, required: true },
  email: { type: String, required: true },
  numeroGSM: { type: String, required: true },
  adresseDomicile: { type: String, required: true },
  codePostal: { type: String, default: "2080" },
  ville: { type: String, default: "ARIANA" },

  // Activity
  activite: { type: String, default: "Elève/étudiant" },
  fonction: { type: String, default: "Neant" },

  // FATCA
  fatca: { type: String, default: "non" },
  citoyenneteAmericaine: { type: String, default: "NON" },
  pays: { type: String, default: "TUN TUNISIENNE" },
  detentionCodeTIN: { type: String, default: "NON" },
  codeTIN: { type: String },
  ligneTelephoniqueUSA: { type: String, default: "NON" },
  detentionGreenCard: { type: String, default: "NON" },
  adressePostaleUSA: { type: String, default: "NON" },
  virementPermanentUSA: { type: String, default: "NON" },
  procurationPersonneUSA: { type: String, default: "NON" },
  detentionSocieteAmericaine: { type: String, default: "NON" },

  // Page 2 - Additional Information
  connuAmenBank: { type: String, required: true },
  connuAmenBankAutre: { type: String },

  // Special functions
  exerceHauteFonction: { type: String, default: "NON" },
  exerceHauteFonctionDetail: {
    fonction: { type: String },
    organisme: { type: String }
  },
  liePersonneHauteFonction: { type: String, default: "NON" },
  liePersonneHauteFonctionDetail: {
    fonction: { type: String },
    organisme: { type: String },
    nomPrenom: { type: String }
  },
  fonctionnaireOrganisationInternationale: { type: String, default: "NON" },
  fonctionnaireOrganisationInternationaleDetail: {
    fonction: { type: String },
    organisme: { type: String }
  },

  // Revenue types
  revenusTypes: {
    salaires: { type: Boolean, default: false },
    honoraires: { type: Boolean, default: false },
    loyers: { type: Boolean, default: false },
    pensions: { type: Boolean, default: false },
    revenusAvoirs: { type: Boolean, default: false },
    autres: { type: Boolean, default: false },
  },
  montantRevenusAnnuels: { type: String },
  montantRevenusMensuels: { type: String },

  // Business Relationship
  objetOuvertureCompte: {
    domiciliationSalaires: { type: Boolean, default: false },
    placements: { type: Boolean, default: false },
    investissementsMarchesFinanciers: { type: Boolean, default: false },
    credits: { type: Boolean, default: false },
    activiteCommerciale: { type: Boolean, default: false },
    autre: { type: Boolean, default: false }
  },
  objetOuvertureCompteAutre: { type: String },

  // Planned transactions
  transactionsEnvisagees: {
    operationsCourantes: { type: Boolean, default: false },
    transfertsCommerciaux: { type: Boolean, default: false },
    transfertsFinanciers: { type: Boolean, default: false },
    epargneDepot: { type: Boolean, default: false },
    credits: { type: Boolean, default: false },
    titres: { type: Boolean, default: false }
  },
  volumeMensuelTransaction: { type: String },

  // Page 3 - Products and Services
  typeCompte: { type: String, required: true },
  agenceContact: { type: String, required: true },
  acceptConditions: { type: Boolean, required: true },

  // Page 4 - Verification and Validation
  documentsValides: { type: Boolean, required: true },
  // For file uploads, you might store file paths or URLs after upload
  cinRecto: { type: String },
  cinVerso: { type: String },
  specimenSignature: { type: String },
  ficheProfilClient: { type: String },
  selfiAvecCIN: { type: String },
  captcha: { type: String },
  status: { type: String, default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('DemandeCreationCompte', demandeCreationSchema);
