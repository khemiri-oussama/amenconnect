"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { IonIcon } from "@ionic/react"
import { arrowBack, brush, trash, arrowForward, checkmarkCircle } from "ionicons/icons"
import SignatureCanvas from "react-signature-canvas"
import "./AccountCreationForm.css"

// Add this interface right after the imports
interface SignatureCanvasRef extends SignatureCanvas {
  penColor: string
  dotSize: number
  clear: () => void
  isEmpty: () => boolean
  getTrimmedCanvas: () => HTMLCanvasElement
  getCanvas: () => HTMLCanvasElement
}

interface AccountCreationFormProps {
  onBack: () => void
}

const AccountCreationForm: React.FC<AccountCreationFormProps> = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [formData, setFormData] = useState({
    // Page 1 fields
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    cin: "",
    dateDelivrance: "",
    lieuDelivrance: "",
    telephoneFixe: "",
    telephoneMobile: "",
    email: "",
    profession: "",
    employeur: "",
    adresseEmployeur: "",
    agence: "",
    codeAgence: "",
    telephoneAgence: "",
    faxAgence: "",
    adresse: "",
    codePostal: "",
    rib: "",
    iban: "",
    avecChequier: "non",
    carteBancaire: "non",
    releveCompte: "email",
    lieuSignature: "",
    dateSignature: new Date().toISOString().split("T")[0],

    // Page 2 fields
    situationFamille: "",
    nomConjoint: "",
    prenomConjoint: "",
    nombreEnfants: "0",
    activitePersonne: "",
    nomEmployeur: "",
    adresseEmployeur2: "",
    connuAmenBank: "internet",
    connuAmenBankAutre: "",

    // Fonctions spéciales
    exerceHauteFonction: "non",
    liePersonneHauteFonction: "non",
    fonctionnaireOrganisationInternationale: "non",

    // Type de revenus
    revenusSalaires: false,
    revenusHonoraires: false,
    revenusLoyers: false,
    revenusPensions: false,
    revenusAvoirs: false,
    revenusAutre: false,
    revenusAutreDetail: "",

    // Origine des fonds
    envisageFonds: "non",
    montantFonds: "",

    // Relation d'affaires
    objetDomiciliationSalaire: false,
    objetPlacements: false,
    objetInvestissements: false,
    objetCredit: false,
    objetActivitesCommerciales: false,
    objetAutre: false,
    objetAutreDetail: "",

    // Transactions envisagées
    transactionOperationsCourantes: false,
    transactionTransfertsCommerciaux: false,
    transactionTransfertsFinanciers: false,
    transactionEpargneDepot: false,
    transactionCredit: false,
    transactionTitre: false,

    // Volume mensuel transaction
    volumeMensuelTransaction: "",

    // Indices FATCA
    nationaliteAmericaine: "non",
    citoyenneteAmericaine: "non",
    detentionCodeFiscal: "non",
    detentionGreenCard: "non",
    detentionLigneTelUSA: "non",
    procurationPersonneUSA: "non",
    virementPermanentUSA: "non",
    detentionSocieteAmericaine: "non",
  })

  const [penColor, setPenColor] = useState("#000000")
  const [penSize, setPenSize] = useState(2)
  const [showSignatureTools, setShowSignatureTools] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<string[]>([])

  // Then update the useRef declaration to use our extended interface
  const signatureCanvasRef = useRef<SignatureCanvasRef | null>(null)
  const signatureAreaRef = useRef<HTMLDivElement>(null)

  // Update canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (signatureCanvasRef.current && signatureAreaRef.current) {
        const canvas = signatureCanvasRef.current.getCanvas()
        const container = signatureAreaRef.current
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    window.addEventListener("resize", handleResize)
    // Initial setup
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Check if signature exists after each stroke
  const handleSignatureChange = () => {
    if (signatureCanvasRef.current) {
      const isEmpty = signatureCanvasRef.current.isEmpty()
      setHasSignature(!isEmpty)

      // Update preview if signature exists
      if (!isEmpty) {
        const dataUrl = signatureCanvasRef.current.getTrimmedCanvas().toDataURL("image/png")
        setSignaturePreview(dataUrl)
      } else {
        setSignaturePreview(null)
      }
    }
  }

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear()
      setHasSignature(false)
      setSignaturePreview(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const validatePage1 = () => {
    const errors: string[] = []

    // Check required fields on page 1
    if (!formData.nom) errors.push("Le nom est requis")
    if (!formData.prenom) errors.push("Le prénom est requis")
    if (!formData.dateNaissance) errors.push("La date de naissance est requise")
    if (!formData.lieuNaissance) errors.push("Le lieu de naissance est requis")
    if (!formData.cin) errors.push("Le CIN est requis")
    if (!formData.dateDelivrance) errors.push("La date de délivrance est requise")
    if (!formData.lieuDelivrance) errors.push("Le lieu de délivrance est requis")
    if (!formData.telephoneMobile) errors.push("Le téléphone mobile est requis")
    if (!formData.email) errors.push("L'email est requis")

    setFormErrors(errors)
    return errors.length === 0
  }

  const validatePage2 = () => {
    const errors: string[] = []

    // Check required fields on page 2
    if (!formData.situationFamille) errors.push("La situation de famille est requise")
    if (!formData.activitePersonne) errors.push("L'activité de la personne est requise")
    if (!formData.volumeMensuelTransaction) errors.push("Le volume mensuel de transaction est requis")

    // If "autre" is selected for "connu Amen Bank", check if detail is provided
    if (formData.connuAmenBank === "autre" && !formData.connuAmenBankAutre) {
      errors.push("Veuillez préciser comment vous avez connu Amen Bank")
    }

    // If "autre" is selected for "revenus", check if detail is provided
    if (formData.revenusAutre && !formData.revenusAutreDetail) {
      errors.push("Veuillez préciser le type de revenu autre")
    }

    // If "autre" is selected for "objet relation", check if detail is provided
    if (formData.objetAutre && !formData.objetAutreDetail) {
      errors.push("Veuillez préciser l'objet de la relation d'affaires")
    }

    // Check if at least one revenue type is selected
    if (
      !formData.revenusSalaires &&
      !formData.revenusHonoraires &&
      !formData.revenusLoyers &&
      !formData.revenusPensions &&
      !formData.revenusAvoirs &&
      !formData.revenusAutre
    ) {
      errors.push("Veuillez sélectionner au moins un type de revenu")
    }

    // Check if at least one business relationship purpose is selected
    if (
      !formData.objetDomiciliationSalaire &&
      !formData.objetPlacements &&
      !formData.objetInvestissements &&
      !formData.objetCredit &&
      !formData.objetActivitesCommerciales &&
      !formData.objetAutre
    ) {
      errors.push("Veuillez sélectionner au moins un objet de relation d'affaires")
    }

    // Check if at least one transaction type is selected
    if (
      !formData.transactionOperationsCourantes &&
      !formData.transactionTransfertsCommerciaux &&
      !formData.transactionTransfertsFinanciers &&
      !formData.transactionEpargneDepot &&
      !formData.transactionCredit &&
      !formData.transactionTitre
    ) {
      errors.push("Veuillez sélectionner au moins un type de transaction envisagée")
    }

    // If funds are planned, check if amount is provided
    if (formData.envisageFonds === "oui" && !formData.montantFonds) {
      errors.push("Veuillez préciser le montant des fonds envisagés")
    }

    setFormErrors(errors)
    return errors.length === 0
  }

  const goToNextPage = () => {
    if (currentPage === 1) {
      if (validatePage1()) {
        setCurrentPage(2)
        setFormErrors([])
        window.scrollTo(0, 0)
      }
    }
  }

  const goToPreviousPage = () => {
    if (currentPage === 2) {
      setCurrentPage(1)
      setFormErrors([])
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate current page
    if (currentPage === 1) {
      if (validatePage1()) {
        goToNextPage()
      }
      return
    }

    // For page 2, validate and submit
    if (!validatePage2()) {
      return
    }

    if (!hasSignature) {
      setFormErrors([...formErrors, "Veuillez signer le document avant de soumettre."])
      return
    }

    // Get signature as data URL
    const signatureDataUrl = signatureCanvasRef.current?.getTrimmedCanvas().toDataURL("image/png")

    // Here you would typically send the form data and signature to your backend
    console.log("Form submitted:", formData)
    console.log("Signature:", signatureDataUrl)

    // Show confirmation or navigate to a thank you page
    alert("Votre demande a été soumise avec succès. Nous vous contacterons bientôt.")
    onBack()
  }

  const toggleSignatureTools = () => {
    setShowSignatureTools(!showSignatureTools)
  }

  const handlePenColorChange = (color: string) => {
    setPenColor(color)
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.penColor = color
    }
  }

  const handlePenSizeChange = (size: number) => {
    setPenSize(size)
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.dotSize = size
    }
  }

  return (
    <div className="acf-container acf-animate-fade-in">
      <div className="acf-paper-content">
        <button className="acf-back-button" onClick={onBack}>
          <IonIcon icon={arrowBack} />
        </button>

        <div className="acf-paper-header">
          <div className="acf-bank-logo">
            <img src="favicon.png" alt="Amen Bank Logo" />
          </div>
          <div className="acf-document-title">
            <h1>CONVENTION DE GESTION DE COMPTE DE DÉPÔT</h1>
            <h2>PERSONNE PHYSIQUE</h2>
          </div>
        </div>

        {formErrors.length > 0 && (
          <div className="acf-error-container">
            <h4>Veuillez corriger les erreurs suivantes:</h4>
            <ul>
              {formErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="acf-pagination">
          <div className={`acf-page-indicator ${currentPage === 1 ? "acf-active" : ""}`}>
            <span className="acf-page-number">1</span>
            <span className="acf-page-label">Informations de base</span>
          </div>
          <div className="acf-page-line"></div>
          <div className={`acf-page-indicator ${currentPage === 2 ? "acf-active" : ""}`}>
            <span className="acf-page-number">2</span>
            <span className="acf-page-label">Informations complémentaires</span>
          </div>
        </div>

        <form className="acf-paper-form" onSubmit={handleSubmit}>
          {currentPage === 1 && (
            <>
              <section className="acf-form-section">
                <h3 className="acf-section-title">Informations Personnelles</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="nom">Nom</label>
                    <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleInputChange} required />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="dateNaissance">Né(e) le</label>
                    <input
                      type="date"
                      id="dateNaissance"
                      name="dateNaissance"
                      value={formData.dateNaissance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="lieuNaissance">Lieu de naissance</label>
                    <input
                      type="text"
                      id="lieuNaissance"
                      name="lieuNaissance"
                      value={formData.lieuNaissance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="cin">CIN</label>
                    <input type="text" id="cin" name="cin" value={formData.cin} onChange={handleInputChange} required />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="dateDelivrance">Délivrée le</label>
                    <input
                      type="date"
                      id="dateDelivrance"
                      name="dateDelivrance"
                      value={formData.dateDelivrance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="lieuDelivrance">à</label>
                    <input
                      type="text"
                      id="lieuDelivrance"
                      name="lieuDelivrance"
                      value={formData.lieuDelivrance}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Coordonnées</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="telephoneFixe">Téléphone fixe</label>
                    <input
                      type="tel"
                      id="telephoneFixe"
                      name="telephoneFixe"
                      value={formData.telephoneFixe}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="telephoneMobile">Téléphone mobile</label>
                    <input
                      type="tel"
                      id="telephoneMobile"
                      name="telephoneMobile"
                      value={formData.telephoneMobile}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="email">E-mail</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Informations Professionnelles</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="profession">Profession</label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="employeur">Employeur</label>
                    <input
                      type="text"
                      id="employeur"
                      name="employeur"
                      value={formData.employeur}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="adresseEmployeur">Adresse employeur</label>
                    <input
                      type="text"
                      id="adresseEmployeur"
                      name="adresseEmployeur"
                      value={formData.adresseEmployeur}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Informations Bancaires</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="agence">Agence</label>
                    <input
                      type="text"
                      id="agence"
                      name="agence"
                      value={formData.agence}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="codeAgence">Code</label>
                    <input
                      type="text"
                      id="codeAgence"
                      name="codeAgence"
                      value={formData.codeAgence}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="telephoneAgence">Téléphone</label>
                    <input
                      type="tel"
                      id="telephoneAgence"
                      name="telephoneAgence"
                      value={formData.telephoneAgence}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="faxAgence">Fax</label>
                    <input
                      type="tel"
                      id="faxAgence"
                      name="faxAgence"
                      value={formData.faxAgence}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="adresse">Adresse</label>
                    <input
                      type="text"
                      id="adresse"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="codePostal">Code postal</label>
                    <input
                      type="text"
                      id="codePostal"
                      name="codePostal"
                      value={formData.codePostal}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="rib">RIB</label>
                    <input type="text" id="rib" name="rib" value={formData.rib} onChange={handleInputChange} />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="iban">IBAN</label>
                    <input type="text" id="iban" name="iban" value={formData.iban} onChange={handleInputChange} />
                  </div>
                </div>
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Options de Compte</h3>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Avec chéquier</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="avecChequier"
                          value="oui"
                          checked={formData.avecChequier === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="avecChequier"
                          value="non"
                          checked={formData.avecChequier === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>

                  <div className="acf-form-field-radio">
                    <label>Carte bancaire</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="carteBancaire"
                          value="oui"
                          checked={formData.carteBancaire === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="carteBancaire"
                          value="non"
                          checked={formData.carteBancaire === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Relevé de compte</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="releveCompte"
                          value="email"
                          checked={formData.releveCompte === "email"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Par email</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="releveCompte"
                          value="courrier"
                          checked={formData.releveCompte === "courrier"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Par courrier</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <div className="acf-form-actions">
                <button type="button" className="acf-cancel-btn" onClick={onBack}>
                  Annuler
                </button>
                <button type="button" className="acf-next-btn" onClick={goToNextPage}>
                  Suivant <IonIcon icon={arrowForward} />
                </button>
              </div>
            </>
          )}

          {currentPage === 2 && (
            <>
              <section className="acf-form-section">
                <h3 className="acf-section-title">Informations Personnelles Complémentaires</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="situationFamille">Situation de famille</label>
                    <select
                      id="situationFamille"
                      name="situationFamille"
                      value={formData.situationFamille}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez</option>
                      <option value="célibataire">Célibataire</option>
                      <option value="marié(e)">Marié(e)</option>
                      <option value="divorcé(e)">Divorcé(e)</option>
                      <option value="veuf(ve)">Veuf(ve)</option>
                    </select>
                  </div>
                </div>

                {formData.situationFamille === "marié(e)" && (
                  <div className="acf-form-row">
                    <div className="acf-form-field">
                      <label htmlFor="nomConjoint">Nom du conjoint</label>
                      <input
                        type="text"
                        id="nomConjoint"
                        name="nomConjoint"
                        value={formData.nomConjoint}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="acf-form-field">
                      <label htmlFor="prenomConjoint">Prénom du conjoint</label>
                      <input
                        type="text"
                        id="prenomConjoint"
                        name="prenomConjoint"
                        value={formData.prenomConjoint}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="nombreEnfants">Nombre d'enfants à charge</label>
                    <input
                      type="number"
                      id="nombreEnfants"
                      name="nombreEnfants"
                      min="0"
                      value={formData.nombreEnfants}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="activitePersonne">Activité de la personne</label>
                    <input
                      type="text"
                      id="activitePersonne"
                      name="activitePersonne"
                      value={formData.activitePersonne}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="nomEmployeur">Nom de l'employeur</label>
                    <input
                      type="text"
                      id="nomEmployeur"
                      name="nomEmployeur"
                      value={formData.nomEmployeur}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="adresseEmployeur2">Adresse de l'employeur</label>
                    <input
                      type="text"
                      id="adresseEmployeur2"
                      name="adresseEmployeur2"
                      value={formData.adresseEmployeur2}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Comment avez-vous connu Amen Bank ?</h3>
                <div className="acf-form-row">
                  <div className="acf-radio-options">
                    <label className="acf-radio-label">
                      <input
                        type="radio"
                        name="connuAmenBank"
                        value="internet"
                        checked={formData.connuAmenBank === "internet"}
                        onChange={handleRadioChange}
                      />
                      <span className="acf-radio-text">Internet</span>
                    </label>
                    <label className="acf-radio-label">
                      <input
                        type="radio"
                        name="connuAmenBank"
                        value="bouche-a-oreille"
                        checked={formData.connuAmenBank === "bouche-a-oreille"}
                        onChange={handleRadioChange}
                      />
                      <span className="acf-radio-text">Bouche à oreille</span>
                    </label>
                    <label className="acf-radio-label">
                      <input
                        type="radio"
                        name="connuAmenBank"
                        value="presse"
                        checked={formData.connuAmenBank === "presse"}
                        onChange={handleRadioChange}
                      />
                      <span className="acf-radio-text">Presse</span>
                    </label>
                    <label className="acf-radio-label">
                      <input
                        type="radio"
                        name="connuAmenBank"
                        value="affichage"
                        checked={formData.connuAmenBank === "affichage"}
                        onChange={handleRadioChange}
                      />
                      <span className="acf-radio-text">Affichage</span>
                    </label>
                    <label className="acf-radio-label">
                      <input
                        type="radio"
                        name="connuAmenBank"
                        value="autre"
                        checked={formData.connuAmenBank === "autre"}
                        onChange={handleRadioChange}
                      />
                      <span className="acf-radio-text">Autre</span>
                    </label>
                  </div>
                </div>

                {formData.connuAmenBank === "autre" && (
                  <div className="acf-form-row">
                    <div className="acf-form-field">
                      <label htmlFor="connuAmenBankAutre">Précisez</label>
                      <input
                        type="text"
                        id="connuAmenBankAutre"
                        name="connuAmenBankAutre"
                        value={formData.connuAmenBankAutre}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Fonctions Spéciales</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>A-t-il exercé ou exerce-t-il un mandat/une haute fonction publique ?</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="exerceHauteFonction"
                          value="oui"
                          checked={formData.exerceHauteFonction === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="exerceHauteFonction"
                          value="non"
                          checked={formData.exerceHauteFonction === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Est-il lié à une personne exerçant une haute fonction publique ?</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="liePersonneHauteFonction"
                          value="oui"
                          checked={formData.liePersonneHauteFonction === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="liePersonneHauteFonction"
                          value="non"
                          checked={formData.liePersonneHauteFonction === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Est-il fonctionnaire d'une organisation internationale ?</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="fonctionnaireOrganisationInternationale"
                          value="oui"
                          checked={formData.fonctionnaireOrganisationInternationale === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="fonctionnaireOrganisationInternationale"
                          value="non"
                          checked={formData.fonctionnaireOrganisationInternationale === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Type de Revenus</h3>
                <div className="acf-form-row">
                  <div className="acf-checkbox-group">
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="revenusSalaires"
                        checked={formData.revenusSalaires}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Salaires/Traitements</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="revenusHonoraires"
                        checked={formData.revenusHonoraires}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Honoraires</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="revenusLoyers"
                        checked={formData.revenusLoyers}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Loyers</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="revenusPensions"
                        checked={formData.revenusPensions}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Pensions</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="revenusAvoirs"
                        checked={formData.revenusAvoirs}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Revenus sur avoirs</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="revenusAutre"
                        checked={formData.revenusAutre}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Autre</span>
                    </label>
                  </div>
                </div>

                {formData.revenusAutre && (
                  <div className="acf-form-row">
                    <div className="acf-form-field">
                      <label htmlFor="revenusAutreDetail">Précisez</label>
                      <input
                        type="text"
                        id="revenusAutreDetail"
                        name="revenusAutreDetail"
                        value={formData.revenusAutreDetail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Origine des Fonds</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Est-ce que vous envisagez des fonds dès l'ouverture du compte ?</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="envisageFonds"
                          value="oui"
                          checked={formData.envisageFonds === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="envisageFonds"
                          value="non"
                          checked={formData.envisageFonds === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.envisageFonds === "oui" && (
                  <div className="acf-form-row">
                    <div className="acf-form-field">
                      <label htmlFor="montantFonds">Montant</label>
                      <input
                        type="text"
                        id="montantFonds"
                        name="montantFonds"
                        value={formData.montantFonds}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Relation d'Affaires</h3>
                <h4 className="acf-subsection-title">Objet de la relation d'affaires</h4>
                <div className="acf-form-row">
                  <div className="acf-checkbox-group">
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="objetDomiciliationSalaire"
                        checked={formData.objetDomiciliationSalaire}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Domiciliation salaire</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="objetPlacements"
                        checked={formData.objetPlacements}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Placements</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="objetInvestissements"
                        checked={formData.objetInvestissements}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Investissements sur marchés financiers</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="objetCredit"
                        checked={formData.objetCredit}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Crédit</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="objetActivitesCommerciales"
                        checked={formData.objetActivitesCommerciales}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Activités commerciales</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="objetAutre"
                        checked={formData.objetAutre}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Autre</span>
                    </label>
                  </div>
                </div>

                {formData.objetAutre && (
                  <div className="acf-form-row">
                    <div className="acf-form-field">
                      <label htmlFor="objetAutreDetail">Précisez</label>
                      <input
                        type="text"
                        id="objetAutreDetail"
                        name="objetAutreDetail"
                        value={formData.objetAutreDetail}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                <h4 className="acf-subsection-title">Transactions envisagées</h4>
                <div className="acf-form-row">
                  <div className="acf-checkbox-group">
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="transactionOperationsCourantes"
                        checked={formData.transactionOperationsCourantes}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Opérations courantes (chèque, effets, carte, virements)</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="transactionTransfertsCommerciaux"
                        checked={formData.transactionTransfertsCommerciaux}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Transferts commerciaux</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="transactionTransfertsFinanciers"
                        checked={formData.transactionTransfertsFinanciers}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Transferts financiers</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="transactionEpargneDepot"
                        checked={formData.transactionEpargneDepot}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Épargne/Dépôt</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="transactionCredit"
                        checked={formData.transactionCredit}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Crédit</span>
                    </label>
                    <label className="acf-checkbox-label">
                      <input
                        type="checkbox"
                        name="transactionTitre"
                        checked={formData.transactionTitre}
                        onChange={handleCheckboxChange}
                      />
                      <span className="acf-checkbox-text">Titre</span>
                    </label>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="volumeMensuelTransaction">Volume mensuel de transaction</label>
                    <select
                      id="volumeMensuelTransaction"
                      name="volumeMensuelTransaction"
                      value={formData.volumeMensuelTransaction}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez</option>
                      <option value="moins-5000">Moins de 5 000 DT</option>
                      <option value="5000-10000">Entre 5 000 et 10 000 DT</option>
                      <option value="10000-50000">Entre 10 000 et 50 000 DT</option>
                      <option value="50000-100000">Entre 50 000 et 100 000 DT</option>
                      <option value="plus-100000">Plus de 100 000 DT</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="acf-form-section">
                <h3 className="acf-section-title">Indices FATCA</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Nationalité américaine</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="nationaliteAmericaine"
                          value="oui"
                          checked={formData.nationaliteAmericaine === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="nationaliteAmericaine"
                          value="non"
                          checked={formData.nationaliteAmericaine === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Citoyenneté américaine</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="citoyenneteAmericaine"
                          value="oui"
                          checked={formData.citoyenneteAmericaine === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="citoyenneteAmericaine"
                          value="non"
                          checked={formData.citoyenneteAmericaine === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Détention code fiscal américain</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="detentionCodeFiscal"
                          value="oui"
                          checked={formData.detentionCodeFiscal === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="detentionCodeFiscal"
                          value="non"
                          checked={formData.detentionCodeFiscal === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Détention Green Card</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="detentionGreenCard"
                          value="oui"
                          checked={formData.detentionGreenCard === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="detentionGreenCard"
                          value="non"
                          checked={formData.detentionGreenCard === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Détention ligne téléphonique USA</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="detentionLigneTelUSA"
                          value="oui"
                          checked={formData.detentionLigneTelUSA === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="detentionLigneTelUSA"
                          value="non"
                          checked={formData.detentionLigneTelUSA === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Procuration à une personne ayant une adresse aux USA</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="procurationPersonneUSA"
                          value="oui"
                          checked={formData.procurationPersonneUSA === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="procurationPersonneUSA"
                          value="non"
                          checked={formData.procurationPersonneUSA === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="acf-form-row">
                  <div className="acf-form-field-radio">
                    <label>Virement permanent pour les USA ou détenant 10% ou plus dans une société américaine</label>
                    <div className="acf-radio-group">
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="virementPermanentUSA"
                          value="oui"
                          checked={formData.virementPermanentUSA === "oui"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Oui</span>
                      </label>
                      <label className="acf-radio-label">
                        <input
                          type="radio"
                          name="virementPermanentUSA"
                          value="non"
                          checked={formData.virementPermanentUSA === "non"}
                          onChange={handleRadioChange}
                        />
                        <span className="acf-radio-text">Non</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section className="acf-form-section acf-terms-section">
                <h3 className="acf-section-title">Conditions Générales</h3>
                <div className="acf-terms-content">
                  <p>
                    La présente convention a pour objet de fixer les modalités d'ouverture, de fonctionnement et de
                    clôture du compte de dépôt ouvert par le client auprès d'AMEN BANK.
                  </p>
                  <p>
                    Le client déclare et reconnaît avoir pris connaissance des conditions générales et particulières de
                    la présente convention et les accepter sans réserve.
                  </p>
                  <p>
                    Le client s'engage à informer AMEN BANK de tout changement qui pourrait survenir pendant la durée de
                    la convention, concernant notamment son état civil, sa capacité, son adresse ou toute autre
                    information pertinente.
                  </p>
                  <p>
                    Le client autorise AMEN BANK à prélever sur son compte tous les frais, commissions et autres sommes
                    dues au titre des services fournis.
                  </p>
                  <p>
                    Le client reconnaît avoir été informé des conditions tarifaires applicables à la date de signature
                    de la présente convention.
                  </p>
                  <p>
                    AMEN BANK se réserve le droit de modifier les conditions générales et particulières de la présente
                    convention. Ces modifications seront portées à la connaissance du client par tout moyen approprié.
                  </p>
                  <p>
                    Le client dispose d'un délai de deux mois à compter de cette information pour refuser ces
                    modifications et dénoncer la convention. Passé ce délai, le client est réputé avoir accepté les
                    modifications.
                  </p>
                  <p>
                    La présente convention est conclue pour une durée indéterminée. Elle peut être résiliée à tout
                    moment par le client ou par AMEN BANK, sous réserve d'un préavis de 30 jours.
                  </p>
                  <p>
                    En cas de clôture du compte, le client s'engage à restituer tous les moyens de paiement en sa
                    possession.
                  </p>
                  <p>
                    Le client reconnaît avoir été informé que les données à caractère personnel recueillies dans le
                    cadre de la présente convention font l'objet d'un traitement informatisé destiné à la gestion de sa
                    relation bancaire avec AMEN BANK.
                  </p>
                  <p>
                    Conformément à la loi, le client peut exercer son droit d'accès, de rectification et d'opposition
                    aux informations qui le concernent.
                  </p>
                </div>
              </section>

              <section className="acf-form-section acf-signature-section">
                <h3 className="acf-section-title">Signature</h3>
                <div className="acf-form-row">
                  <div className="acf-form-field">
                    <label htmlFor="lieuSignature">Fait en deux exemplaires à</label>
                    <input
                      type="text"
                      id="lieuSignature"
                      name="lieuSignature"
                      value={formData.lieuSignature}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="acf-form-field">
                    <label htmlFor="dateSignature">Le</label>
                    <input
                      type="date"
                      id="dateSignature"
                      name="dateSignature"
                      value={formData.dateSignature}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="acf-signature-boxes">
                  <div className="acf-signature-box acf-bank-signature">
                    <div className="acf-signature-label">Signature AMEN BANK</div>
                    <div className="acf-signature-area acf-bank">
                      <img src="/placeholder.svg?height=100&width=200" alt="Signature AMEN BANK" />
                    </div>
                  </div>

                  <div className="acf-signature-box acf-client-signature">
                    <div className="acf-signature-label">Signature du titulaire</div>
                    <div className="acf-signature-container">
                      <div
                        className={`acf-signature-area acf-client ${hasSignature ? "acf-has-signature" : ""}`}
                        ref={signatureAreaRef}
                      >
                        <SignatureCanvas
                          ref={signatureCanvasRef}
                          penColor={penColor}
                          dotSize={penSize}
                          canvasProps={{
                            className: "acf-signature-canvas",
                            width: 300,
                            height: 150,
                          }}
                          onEnd={handleSignatureChange}
                        />
                        {!hasSignature && (
                          <div className="acf-signature-placeholder">
                            <span>Signez ici</span>
                          </div>
                        )}
                      </div>

                      <div className="acf-signature-tools">
                        <button
                          type="button"
                          className="acf-signature-tool-btn"
                          onClick={toggleSignatureTools}
                          title="Options de signature"
                        >
                          <IonIcon icon={brush} />
                        </button>
                        <button
                          type="button"
                          className="acf-signature-tool-btn"
                          onClick={clearSignature}
                          title="Effacer la signature"
                        >
                          <IonIcon icon={trash} />
                        </button>

                        {showSignatureTools && (
                          <div className="acf-signature-options">
                            <div className="acf-pen-colors">
                              <span className="acf-tool-label">Couleur:</span>
                              <div className="acf-color-options">
                                <button
                                  type="button"
                                  className={`acf-color-option ${penColor === "#000000" ? "acf-active" : ""}`}
                                  style={{ backgroundColor: "#000000" }}
                                  onClick={() => handlePenColorChange("#000000")}
                                  title="Noir"
                                />
                                <button
                                  type="button"
                                  className={`acf-color-option ${penColor === "#0000FF" ? "acf-active" : ""}`}
                                  style={{ backgroundColor: "#0000FF" }}
                                  onClick={() => handlePenColorChange("#0000FF")}
                                  title="Bleu"
                                />
                                <button
                                  type="button"
                                  className={`acf-color-option ${penColor === "#121660" ? "acf-active" : ""}`}
                                  style={{ backgroundColor: "#121660" }}
                                  onClick={() => handlePenColorChange("#121660")}
                                  title="Bleu foncé"
                                />
                              </div>
                            </div>

                            <div className="acf-pen-sizes">
                              <span className="acf-tool-label">Épaisseur:</span>
                              <div className="acf-size-options">
                                <button
                                  type="button"
                                  className={`acf-size-option ${penSize === 1 ? "acf-active" : ""}`}
                                  onClick={() => handlePenSizeChange(1)}
                                  title="Fin"
                                >
                                  <div className="acf-size-preview acf-size-small"></div>
                                </button>
                                <button
                                  type="button"
                                  className={`acf-size-option ${penSize === 2 ? "acf-active" : ""}`}
                                  onClick={() => handlePenSizeChange(2)}
                                  title="Moyen"
                                >
                                  <div className="acf-size-preview acf-size-medium"></div>
                                </button>
                                <button
                                  type="button"
                                  className={`acf-size-option ${penSize === 3 ? "acf-active" : ""}`}
                                  onClick={() => handlePenSizeChange(3)}
                                  title="Épais"
                                >
                                  <div className="acf-size-preview acf-size-large"></div>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {signaturePreview && (
                      <div className="acf-signature-preview">
                        <div className="acf-preview-label">Aperçu de la signature</div>
                        <div className="acf-preview-image">
                          <img src={signaturePreview || "/placeholder.svg"} alt="Aperçu de la signature" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="acf-form-actions">
                <button type="button" className="acf-back-btn" onClick={goToPreviousPage}>
                  <IonIcon icon={arrowBack} /> Précédent
                </button>
                <button type="submit" className="acf-submit-btn">
                  Soumettre la demande <IonIcon icon={checkmarkCircle} />
                </button>
              </div>
            </>
          )}
        </form>

        <div className="acf-paper-footer">
          <div className="acf-footer-text">AMEN BANK © {new Date().getFullYear()} - Tous droits réservés</div>
          <div className="acf-page-number">Page {currentPage}/2</div>
        </div>
      </div>
    </div>
  )
}

export default AccountCreationForm