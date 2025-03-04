"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { IonIcon } from "@ionic/react"
import { arrowBack, brush, trash } from "ionicons/icons"
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
  const [formData, setFormData] = useState({
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
  })

  const [penColor, setPenColor] = useState("#000000")
  const [penSize, setPenSize] = useState(2)
  const [showSignatureTools, setShowSignatureTools] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasSignature) {
      alert("Veuillez signer le document avant de soumettre.")
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

        <form className="acf-paper-form" onSubmit={handleSubmit}>
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

          <section className="acf-form-section acf-terms-section">
            <h3 className="acf-section-title">Conditions Générales</h3>
            <div className="acf-terms-content">
              <p>
                La présente convention a pour objet de fixer les modalités d'ouverture, de fonctionnement et de clôture
                du compte de dépôt ouvert par le client auprès d'AMEN BANK.
              </p>
              <p>
                Le client déclare et reconnaît avoir pris connaissance des conditions générales et particulières de la
                présente convention et les accepter sans réserve.
              </p>
              <p>
                Le client s'engage à informer AMEN BANK de tout changement qui pourrait survenir pendant la durée de la
                convention, concernant notamment son état civil, sa capacité, son adresse ou toute autre information
                pertinente.
              </p>
              <p>
                Le client autorise AMEN BANK à prélever sur son compte tous les frais, commissions et autres sommes dues
                au titre des services fournis.
              </p>
              <p>
                Le client reconnaît avoir été informé des conditions tarifaires applicables à la date de signature de la
                présente convention.
              </p>
              <p>
                AMEN BANK se réserve le droit de modifier les conditions générales et particulières de la présente
                convention. Ces modifications seront portées à la connaissance du client par tout moyen approprié.
              </p>
              <p>
                Le client dispose d'un délai de deux mois à compter de cette information pour refuser ces modifications
                et dénoncer la convention. Passé ce délai, le client est réputé avoir accepté les modifications.
              </p>
              <p>
                La présente convention est conclue pour une durée indéterminée. Elle peut être résiliée à tout moment
                par le client ou par AMEN BANK, sous réserve d'un préavis de 30 jours.
              </p>
              <p>
                En cas de clôture du compte, le client s'engage à restituer tous les moyens de paiement en sa
                possession.
              </p>
              <p>
                Le client reconnaît avoir été informé que les données à caractère personnel recueillies dans le cadre de
                la présente convention font l'objet d'un traitement informatisé destiné à la gestion de sa relation
                bancaire avec AMEN BANK.
              </p>
              <p>
                Conformément à la loi, le client peut exercer son droit d'accès, de rectification et d'opposition aux
                informations qui le concernent.
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
            <button type="button" className="acf-cancel-btn" onClick={onBack}>
              Annuler
            </button>
            <button type="submit" className="acf-submit-btn">
              Soumettre la demande
            </button>
          </div>
        </form>

        <div className="acf-paper-footer">
          <div className="acf-footer-text">AMEN BANK © {new Date().getFullYear()} - Tous droits réservés</div>
          <div className="acf-page-number">Page 1/1</div>
        </div>
      </div>
    </div>
  )
}

export default AccountCreationForm

