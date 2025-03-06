import type React from "react"
import type { FormData, SignatureCanvasRef } from "./types"
import ReCAPTCHA from "react-google-recaptcha"
interface Page4Props {
  formData: FormData
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  signatureCanvasRef: React.RefObject<SignatureCanvasRef>
  signatureAreaRef: React.RefObject<HTMLDivElement>
  clearSignature: () => void
  handleSignatureChange: () => void
  showSignatureTools: boolean
  toggleSignatureTools: () => void
  penColor: string
  penSize: number
  handlePenColorChange: (color: string) => void
  handlePenSizeChange: (size: number) => void
  hasSignature: boolean
  signaturePreview: string | null
  formErrors: string[]
  handleCaptchaChange: (token: string | null) => void
}

const Page4Component: React.FC<Page4Props> = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleFileChange,
  signatureCanvasRef,
  signatureAreaRef,
  clearSignature,
  handleSignatureChange,
  showSignatureTools,
  toggleSignatureTools,
  penColor,
  penSize,
  handlePenColorChange,
  handlePenSizeChange,
  hasSignature,
  signaturePreview,
  formErrors,
  handleCaptchaChange,
}) => {
  return (
    <>
      <section className="acf-form-section">
        <h3 className="acf-section-title">Vérification et Validation</h3>
        <div className="acf-validation-instructions">
          <h4>Instructions:</h4>
          <ol>
            <li>Vérifiez l'exactitude des informations personnelles saisies.</li>
            <li>Assurez-vous que tous les documents requis sont prêts à être téléchargés.</li>
            <li>Signez électroniquement le formulaire en utilisant l'outil de signature ci-dessous.</li>
            <li>Complétez le captcha pour finaliser votre demande.</li>
          </ol>
        </div>

        <div className="acf-personal-info-summary">
          <h4>Récapitulatif des informations personnelles:</h4>
          <div className="acf-summary-table">
            <div className="acf-summary-row">
              <div className="acf-summary-label">Nom</div>
              <div className="acf-summary-value">{formData.nom}</div>
            </div>
            <div className="acf-summary-row">
              <div className="acf-summary-label">Prénom</div>
              <div className="acf-summary-value">{formData.prenom}</div>
            </div>
            <div className="acf-summary-row">
              <div className="acf-summary-label">Date de naissance</div>
              <div className="acf-summary-value">{formData.dateNaissance}</div>
            </div>
            <div className="acf-summary-row">
              <div className="acf-summary-label">N° CIN</div>
              <div className="acf-summary-value">{formData.numeroCIN}</div>
            </div>
            <div className="acf-summary-row">
              <div className="acf-summary-label">Email</div>
              <div className="acf-summary-value">{formData.email}</div>
            </div>
            <div className="acf-summary-row">
              <div className="acf-summary-label">GSM</div>
              <div className="acf-summary-value">{formData.numeroGSM}</div>
            </div>
            <div className="acf-summary-row">
              <div className="acf-summary-label">Type de compte</div>
              <div className="acf-summary-value">{formData.typeCompte}</div>
            </div>
            <div className="acf-summary-row">
              <div className="acf-summary-label">Agence</div>
              <div className="acf-summary-value">{formData.agenceContact}</div>
            </div>
          </div>
        </div>

        <div className="acf-form-row">
          <div className="acf-form-field-radio">
            <label className="acf-checkbox-label">
              <input
                type="checkbox"
                name="documentsValides"
                checked={formData.documentsValides}
                onChange={handleCheckboxChange}
              />
              <span className="acf-checkbox-text">
                Je certifie que les informations fournies sont exactes et complètes
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="acf-form-section">
        <h3 className="acf-section-title">Téléchargement des documents</h3>
        <div className="acf-form-row">
          <div className="acf-form-field">
            <label>
              Carte d'identité nationale (Recto)<span className="required">**</span>
            </label>
            <div className="acf-file-input">
              <input type="file" id="cinRecto" name="cinRecto" accept="image/*,.pdf" onChange={handleFileChange} />
              <label htmlFor="cinRecto"></label>
              <div className="acf-file-status">
                {formData.cinRecto ? formData.cinRecto.name : "Aucun fichier sélectionné"}
              </div>
            </div>
          </div>
          <div className="acf-form-field">
            <label>
              Carte d'identité nationale (Verso)<span className="required">**</span>
            </label>
            <div className="acf-file-input">
              <input type="file" id="cinVerso" name="cinVerso" accept="image/*,.pdf" onChange={handleFileChange} />
              <label htmlFor="cinVerso"></label>
              <div className="acf-file-status">
                {formData.cinVerso ? formData.cinVerso.name : "Aucun fichier sélectionné"}
              </div>
            </div>
          </div>
        </div>

        <div className="acf-form-row">
          <div className="acf-form-field">
            <label>
              Fiche profil client signée<span className="required">**</span>
            </label>
            <div className="acf-file-input">
              <input
                type="file"
                id="ficheProfilClient"
                name="ficheProfilClient"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="ficheProfilClient"></label>
              <div className="acf-file-status">
                {formData.ficheProfilClient ? formData.ficheProfilClient.name : "Aucun fichier sélectionné"}
              </div>
            </div>
          </div>
          <div className="acf-form-field">
            <label>
              Spécimen de signature<span className="required">**</span>
            </label>
            <div className="acf-file-input">
              <input
                type="file"
                id="specimenSignature"
                name="specimenSignature"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="specimenSignature"></label>
              <div className="acf-file-status">
                {formData.specimenSignature ? formData.specimenSignature.name : "Aucun fichier sélectionné"}
              </div>
            </div>
          </div>
        </div>

        <div className="acf-form-row">
          <div className="acf-form-field">
            <label>
              Selfie avec CIN<span className="required">**</span>
            </label>
            <div className="acf-file-input">
              <input type="file" id="selfiAvecCIN" name="selfiAvecCIN" accept="image/*" onChange={handleFileChange} />
              <label htmlFor="selfiAvecCIN"></label>
              <div className="acf-file-status">
                {formData.selfiAvecCIN ? formData.selfiAvecCIN.name : "Aucun fichier sélectionné"}
              </div>
            </div>
          </div>
        </div>

        <div className="acf-download-links">
          <a href="#" className="acf-download-link">
            Télécharger la fiche profil client
          </a>
          <a href="#" className="acf-download-link">
            Télécharger le spécimen de signature
          </a>
        </div>
      </section>

      <section className="acf-form-section acf-signature-section">
        <h3 className="acf-section-title">Signature Électronique</h3>
        <div className="acf-signature-boxes">
          <div className="acf-signature-box">
            <div className="acf-signature-label">Signature du Client</div>
            <div className="acf-signature-container">
              <div
                ref={signatureAreaRef}
                className={`acf-signature-area acf-client ${hasSignature ? "acf-has-signature" : ""}`}
              >
                {!hasSignature && (
                  <div className="acf-signature-placeholder">
                    <span>Signez ici</span>
                  </div>
                )}
                {typeof window !== "undefined" && window.SignatureCanvas && (
                  <window.SignatureCanvas
                    ref={signatureCanvasRef as any}
                    canvasProps={{
                      className: "acf-signature-canvas",
                      width: 500,
                      height: 150,
                    }}
                    onEnd={handleSignatureChange}
                    penColor={penColor}
                    dotSize={penSize}
                  />
                )}
              </div>
              <div className="acf-signature-tools">
                <button type="button" className="acf-signature-tool-btn" onClick={clearSignature}>
                  ✕
                </button>
                <button type="button" className="acf-signature-tool-btn" onClick={toggleSignatureTools}>
                  ⚙️
                </button>

                {showSignatureTools && (
                  <div className="acf-signature-options">
                    <div className="acf-pen-colors">
                      <span className="acf-tool-label">Couleur:</span>
                      <div className="acf-color-options">
                        <div
                          className={`acf-color-option ${penColor === "#000000" ? "acf-active" : ""}`}
                          style={{ backgroundColor: "#000000" }}
                          onClick={() => handlePenColorChange("#000000")}
                        ></div>
                        <div
                          className={`acf-color-option ${penColor === "#0000FF" ? "acf-active" : ""}`}
                          style={{ backgroundColor: "#0000FF" }}
                          onClick={() => handlePenColorChange("#0000FF")}
                        ></div>
                        <div
                          className={`acf-color-option ${penColor === "#009688" ? "acf-active" : ""}`}
                          style={{ backgroundColor: "#009688" }}
                          onClick={() => handlePenColorChange("#009688")}
                        ></div>
                        <div
                          className={`acf-color-option ${penColor === "#FF0000" ? "acf-active" : ""}`}
                          style={{ backgroundColor: "#FF0000" }}
                          onClick={() => handlePenColorChange("#FF0000")}
                        ></div>
                      </div>
                    </div>
                    <div className="acf-pen-sizes">
                      <span className="acf-tool-label">Épaisseur:</span>
                      <div className="acf-size-options">
                        <div
                          className={`acf-size-option ${penSize === 1 ? "acf-active" : ""}`}
                          onClick={() => handlePenSizeChange(1)}
                        >
                          <div className="acf-size-preview acf-size-small"></div>
                        </div>
                        <div
                          className={`acf-size-option ${penSize === 2 ? "acf-active" : ""}`}
                          onClick={() => handlePenSizeChange(2)}
                        >
                          <div className="acf-size-preview acf-size-medium"></div>
                        </div>
                        <div
                          className={`acf-size-option ${penSize === 3 ? "acf-active" : ""}`}
                          onClick={() => handlePenSizeChange(3)}
                        >
                          <div className="acf-size-preview acf-size-large"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {signaturePreview && (
              <div className="acf-signature-preview">
                <span className="acf-preview-label">Aperçu:</span>
                <div className="acf-preview-image">
                  <img src={signaturePreview || "/placeholder.svg"} alt="Signature Preview" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="acf-form-section">
        <h3 className="acf-section-title">Captcha</h3>
        <div className="acf-captcha">
          <ReCAPTCHA
            sitekey="6LekFesqAAAAAEW5F4sh4bCYsmaOCwLZse11n4o0"
            onChange={handleCaptchaChange}
          />
        </div>
      </section>
    </>
  )
}

export default Page4Component

