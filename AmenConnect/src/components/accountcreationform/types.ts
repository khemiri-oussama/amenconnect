import type SignatureCanvas from "react-signature-canvas"

export interface ExerceHauteFonctionDetail {
  fonction: string
  organisme: string
}

export interface LiePersonneHauteFonctionDetail {
  fonction: string
  organisme: string
  nomPrenom: string
}

export interface FonctionnaireOrganisationInternationaleDetail {
  fonction: string
  organisme: string
}

export interface RevenusTypes {
  salaires: boolean
  honoraires: boolean
  loyers: boolean
  pensions: boolean
  revenusAvoirs: boolean
  autres: boolean
}

export interface ObjetOuvertureCompte {
  domiciliationSalaires: boolean
  placements: boolean
  investissementsMarchesFinanciers: boolean
  credits: boolean
  activiteCommerciale: boolean
  autre: boolean
}

export interface TransactionsEnvisagees {
  operationsCourantes: boolean
  transfertsCommerciaux: boolean
  transfertsFinanciers: boolean
  epargneDepot: boolean
  credits: boolean
  titres: boolean
}

export interface FormData {
  // Page 1 - Personal Information
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  numeroCIN: string;
  dateDelivranceCIN: string;
  lieuDelivranceCIN: string;
  qualiteJuridique: string;
  situationFamille: string;
  email: string;
  numeroGSM: string;
  adresseDomicile: string;
  codePostal: string;
  ville: string;

  // Activity
  activite: string;
  fonction: string;

  // FATCA
  fatca: string;
  citoyenneteAmericaine: string;
  pays: string;
  detentionCodeTIN: string;
  codeTIN: string;
  ligneTelephoniqueUSA: string;
  detentionGreenCard: string;
  adressePostaleUSA: string;
  virementPermanentUSA: string;
  procurationPersonneUSA: string;
  detentionSocieteAmericaine: string;

  // Page 2 - Additional Information
  connuAmenBank: string;
  connuAmenBankAutre: string;

  // Special functions
  exerceHauteFonction: string;
  exerceHauteFonctionDetail: ExerceHauteFonctionDetail;
  liePersonneHauteFonction: string;
  liePersonneHauteFonctionDetail: LiePersonneHauteFonctionDetail;
  fonctionnaireOrganisationInternationale: string;
  fonctionnaireOrganisationInternationaleDetail: FonctionnaireOrganisationInternationaleDetail;

  // Revenue types
  revenusTypes: RevenusTypes;
  montantRevenusAnnuels: string;
  montantRevenusMensuels: string;

  // Business Relationship
  objetOuvertureCompte: ObjetOuvertureCompte;
  objetOuvertureCompteAutre: string;

  // Planned transactions
  transactionsEnvisagees: TransactionsEnvisagees;
  volumeMensuelTransaction: string;

  // Page 3 - Products and Services
  typeCompte: string;
  agenceContact: string;
  acceptConditions: boolean;

  // New properties for Credit Card selection
  wantCreditCard?: boolean;
  creditCardType?: string;

  // Page 4 - Verification and Validation
  documentsValides: boolean;

  // Document upload
  cinRecto: File | null;
  cinVerso: File | null;
  specimenSignature: File | null;
  ficheProfilClient: File | null;
  selfiAvecCIN: File | null;
}


// Create an extended interface for SignatureCanvas that includes the missing properties
export interface ExtendedSignatureCanvas extends SignatureCanvas {
  penColor: string
  dotSize: number
  clear: () => void
  isEmpty: () => boolean
  getTrimmedCanvas: () => HTMLCanvasElement
  getCanvas: () => HTMLCanvasElement
}

// Use the extended interface for our ref
export type SignatureCanvasRef = ExtendedSignatureCanvas

