import React, { useState, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonItem,
  IonInput,
  IonCheckbox,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonProgressBar,
  IonAlert,
  IonBadge,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  arrowBackOutline,
  lockClosedOutline,
  mailOutline,
  eyeOutline,
  eyeOffOutline,
  personOutline,
  callOutline,
  calendarOutline,
  idCardOutline,
  checkmarkCircleOutline,
  shieldCheckmarkOutline,
  chevronForwardOutline,
  alertCircleOutline,
} from "ionicons/icons"
import KioskLayout from "../components/KioskLayout"
import AnimatedCard from "../components/AnimatedCard"
import { useOrientation } from "../context/OrientationContext"
import "./account-creation.css"

const AccountCreation: React.FC = () => {
  const history = useHistory()
  const { isLandscape } = useOrientation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [formProgress, setFormProgress] = useState(33)
  const [formComplete, setFormComplete] = useState(false)

  // Form fields
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [idType, setIdType] = useState("cin")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  useEffect(() => {
    // Update form progress based on current step
    if (currentStep === 1) {
      setFormProgress(33)
    } else if (currentStep === 2) {
      setFormProgress(66)
    } else if (currentStep === 3) {
      setFormProgress(100)
    }
  }, [currentStep])

  useEffect(() => {
    // Simple password strength checker
    if (!password) {
      setPasswordStrength(0)
      setPasswordFeedback("")
      return
    }

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 25
    if (/[0-9]/.test(password)) strength += 25
    if (/[^A-Za-z0-9]/.test(password)) strength += 25

    setPasswordStrength(strength)

    if (strength < 50) {
      setPasswordFeedback("Faible")
    } else if (strength < 100) {
      setPasswordFeedback("Moyen")
    } else {
      setPasswordFeedback("Fort")
    }
  }, [password])

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!firstName || !lastName || !email || !phone || !birthdate) {
        setAlertMessage("Veuillez remplir tous les champs requis.")
        setShowAlert(true)
        return false
      }

      // Basic email validation
      if (!/\S+@\S+\.\S+/.test(email)) {
        setAlertMessage("Veuillez entrer une adresse email valide.")
        setShowAlert(true)
        return false
      }
    }

    if (step === 2) {
      if (!idNumber || !password || !confirmPassword) {
        setAlertMessage("Veuillez remplir tous les champs requis.")
        setShowAlert(true)
        return false
      }

      if (password !== confirmPassword) {
        setAlertMessage("Les mots de passe ne correspondent pas.")
        setShowAlert(true)
        return false
      }

      if (passwordStrength < 50) {
        setAlertMessage(
          "Votre mot de passe est trop faible. Utilisez au moins 8 caractères avec des lettres majuscules, des chiffres et des caractères spéciaux."
        )
        setShowAlert(true)
        return false
      }
    }

    return true
  }

  const nextStep = () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep(currentStep + 1)
    }, 500)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      setAlertMessage("Vous devez accepter les conditions générales pour créer un compte.")
      setShowAlert(true)
      return
    }

    setIsLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setIsLoading(false)
      setFormComplete(true)

      // Redirect to home after showing success message
      setTimeout(() => {
        history.push("/home")
      }, 3000)
    }, 1500)
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <KioskLayout pageTitle="Création de compte">
          <div className="register-container">
            {formComplete ? (
              <AnimatedCard className="register-success-card">
                <div className="register-success-icon">
                  <IonIcon icon={checkmarkCircleOutline} />
                </div>
                <h2>Compte créé avec succès!</h2>
                <p>Votre compte a été créé avec succès. Vous allez être redirigé vers la page d'accueil.</p>
                <IonProgressBar type="indeterminate" color="success"></IonProgressBar>
              </AnimatedCard>
            ) : (
              <>
                <AnimatedCard delay={100} className="register-progress-card">
                  <div className="register-progress-container">
                    <IonProgressBar value={formProgress / 100} color="success"></IonProgressBar>
                    <div className="register-progress-text">{formProgress}% complété</div>
                  </div>

                  <div className="register-steps">
                    <div className={`register-step ${currentStep >= 1 ? "active" : ""}`}>
                      <div className="register-step-number">1</div>
                      <div className="register-step-label">Informations personnelles</div>
                    </div>
                    <div className="register-step-connector"></div>
                    <div className={`register-step ${currentStep >= 2 ? "active" : ""}`}>
                      <div className="register-step-number">2</div>
                      <div className="register-step-label">Sécurité</div>
                    </div>
                    <div className="register-step-connector"></div>
                    <div className={`register-step ${currentStep >= 3 ? "active" : ""}`}>
                      <div className="register-step-number">3</div>
                      <div className="register-step-label">Confirmation</div>
                    </div>
                  </div>
                </AnimatedCard>

                <AnimatedCard delay={200} className="register-form-card">
                  <form className="register-form" onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                      <div className="register-form-step">
                        <h2>Informations personnelles</h2>
                        <p>Veuillez fournir vos informations personnelles pour créer votre compte</p>

                        <div className="register-form-inputs">
                          <div className="register-input-container">
                            <IonIcon icon={personOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonInput
                                type="text"
                                label="Prénom"
                                labelPlacement="floating"
                                value={firstName}
                                onIonChange={(e) => setFirstName(e.detail.value || "")}
                                required
                                disabled={isLoading}
                              />
                            </IonItem>
                          </div>

                          <div className="register-input-container">
                            <IonIcon icon={personOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonInput
                                type="text"
                                label="Nom"
                                labelPlacement="floating"
                                value={lastName}
                                onIonChange={(e) => setLastName(e.detail.value || "")}
                                required
                                disabled={isLoading}
                              />
                            </IonItem>
                          </div>

                          <div className="register-input-container">
                            <IonIcon icon={mailOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonInput
                                type="email"
                                label="Email"
                                labelPlacement="floating"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value || "")}
                                required
                                disabled={isLoading}
                              />
                            </IonItem>
                          </div>

                          <div className="register-input-container">
                            <IonIcon icon={callOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonInput
                                type="tel"
                                label="Téléphone"
                                labelPlacement="floating"
                                value={phone}
                                onIonChange={(e) => setPhone(e.detail.value || "")}
                                required
                                disabled={isLoading}
                              />
                            </IonItem>
                          </div>

                          <div className="register-input-container">
                            <IonIcon icon={calendarOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonInput
                                type="date"
                                label="Date de naissance"
                                labelPlacement="floating"
                                value={birthdate}
                                onIonChange={(e) => setBirthdate(e.detail.value || "")}
                                required
                                disabled={isLoading}
                              />
                            </IonItem>
                          </div>
                        </div>

                        <div className="register-form-actions">
                          <IonButton fill="clear" className="register-back-button" onClick={() => history.push("/home")}>
                            <IonIcon icon={arrowBackOutline} slot="start" />
                            Annuler
                          </IonButton>
                          <IonButton className="register-next-button" onClick={nextStep} disabled={isLoading}>
                            {isLoading ? (
                              <IonSpinner name="circles" />
                            ) : (
                              <>
                                Suivant
                                <IonIcon icon={chevronForwardOutline} slot="end" />
                              </>
                            )}
                          </IonButton>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="register-form-step">
                        <h2>Sécurité</h2>
                        <p>Sécurisez votre compte avec une pièce d'identité et un mot de passe fort</p>

                        <div className="register-form-inputs">
                          <div className="register-input-container">
                            <IonIcon icon={idCardOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonSelect
                                label="Type de pièce d'identité"
                                labelPlacement="floating"
                                value={idType}
                                onIonChange={(e) => setIdType(e.detail.value)}
                                disabled={isLoading}
                              >
                                <IonSelectOption value="cin">Carte d'identité nationale</IonSelectOption>
                                <IonSelectOption value="passport">Passeport</IonSelectOption>
                                <IonSelectOption value="residence">Carte de séjour</IonSelectOption>
                              </IonSelect>
                            </IonItem>
                          </div>

                          <div className="register-input-container">
                            <IonIcon icon={idCardOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonInput
                                type="text"
                                label="Numéro de pièce d'identité"
                                labelPlacement="floating"
                                value={idNumber}
                                onIonChange={(e) => setIdNumber(e.detail.value || "")}
                                required
                                disabled={isLoading}
                              />
                            </IonItem>
                          </div>

                          <div className="register-input-container">
                            <IonIcon icon={lockClosedOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonInput
                                type={showPassword ? "text" : "password"}
                                label="Mot de passe"
                                labelPlacement="floating"
                                value={password}
                                onIonChange={(e) => setPassword(e.detail.value || "")}
                                required
                                disabled={isLoading}
                              />
                            </IonItem>
                            <div
                              className="register-password-toggle"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                            </div>
                            
                            {password && (
                              <div className="register-password-strength">
                                <div className="register-strength-bar">
                                  <div
                                    className={`register-strength-indicator ${
                                      passwordStrength < 50 ? "weak" : passwordStrength < 100 ? "medium" : "strong"
                                    }`}
                                    style={{ width: `${passwordStrength}%` }}
                                  ></div>
                                </div>
                                <div className="register-strength-text">
                                  <span>{passwordFeedback}</span>
                                  {passwordStrength >= 100 && (
                                    <IonBadge color="success" className="register-strength-badge">
                                      Sécurisé
                                    </IonBadge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="register-input-container">
                            <IonIcon icon={lockClosedOutline} className="register-input-icon" />
                            <IonItem className="register-input-item">
                              <IonInput
                                type={showConfirmPassword ? "text" : "password"}
                                label="Confirmer le mot de passe"
                                labelPlacement="floating"
                                value={confirmPassword}
                                onIonChange={(e) => setConfirmPassword(e.detail.value || "")}
                                required
                                disabled={isLoading}
                              />
                            </IonItem>
                            <div
                              className="register-password-toggle"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                            </div>
                            
                            {confirmPassword && (
                              <div className={`register-password-match ${password === confirmPassword ? 'valid' : 'invalid'}`}>
                                <IonIcon icon={password === confirmPassword ? checkmarkCircleOutline : alertCircleOutline} />
                                <span>
                                  {password === confirmPassword
                                    ? "Les mots de passe correspondent"
                                    : "Les mots de passe ne correspondent pas"}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="register-form-actions">
                          <IonButton fill="clear" className="register-back-button" onClick={prevStep} disabled={isLoading}>
                            <IonIcon icon={arrowBackOutline} slot="start" />
                            Retour
                          </IonButton>
                          <IonButton className="register-next-button" onClick={nextStep} disabled={isLoading}>
                            {isLoading ? (
                              <IonSpinner name="circles" />
                            ) : (
                              <>
                                Suivant
                                <IonIcon icon={chevronForwardOutline} slot="end" />
                              </>
                            )}
                          </IonButton>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="register-form-step">
                        <h2>Confirmation</h2>
                        <p>Vérifiez vos informations et confirmez la création de votre compte</p>

                        <div className="register-summary">
                          <h3>Résumé de vos informations</h3>
                          
                          <div className="register-summary-grid">
                            <div className="register-summary-item">
                              <div className="register-summary-label">Nom complet</div>
                              <div className="register-summary-value">
                                {firstName} {lastName}
                              </div>
                            </div>
                            
                            <div className="register-summary-item">
                              <div className="register-summary-label">Email</div>
                              <div className="register-summary-value">{email}</div>
                            </div>
                            
                            <div className="register-summary-item">
                              <div className="register-summary-label">Téléphone</div>
                              <div className="register-summary-value">{phone}</div>
                            </div>
                            
                            <div className="register-summary-item">
                              <div className="register-summary-label">Date de naissance</div>
                              <div className="register-summary-value">{birthdate}</div>
                            </div>
                            
                            <div className="register-summary-item">
                              <div className="register-summary-label">Pièce d'identité</div>
                              <div className="register-summary-value">
                                {idType === "cin"
                                  ? "Carte d'identité nationale"
                                  : idType === "passport"
                                    ? "Passeport"
                                    : "Carte de séjour"}{" "}
                                - {idNumber}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="register-terms">
                          <div className="register-terms-checkbox">
                            <IonCheckbox
                              checked={agreeTerms}
                              onIonChange={(e) => setAgreeTerms(e.detail.checked)}
                              disabled={isLoading}
                            />
                            <IonLabel>
                              J'accepte les <a href="#">conditions générales</a> et la{" "}
                              <a href="#">politique de confidentialité</a>
                            </IonLabel>
                          </div>
                        </div>

                        <div className="register-security-note">
                          <IonIcon icon={shieldCheckmarkOutline} />
                          <p>Vos données sont sécurisées et ne seront jamais partagées avec des tiers</p>
                        </div>

                        <div className="register-form-actions">
                          <IonButton fill="clear" className="register-back-button" onClick={prevStep} disabled={isLoading}>
                            <IonIcon icon={arrowBackOutline} slot="start" />
                            Retour
                          </IonButton>
                          <IonButton 
                            className="register-submit-button" 
                            type="submit" 
                            disabled={!agreeTerms || isLoading}
                          >
                            {isLoading ? (
                              <IonSpinner name="circles" />
                            ) : (
                              <>
                                Créer mon compte
                                <IonIcon icon={chevronForwardOutline} slot="end" />
                              </>
                            )}
                          </IonButton>
                        </div>
                      </div>
                    )}
                  </form>
                </AnimatedCard>
              </>
            )}
          </div>
        </KioskLayout>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Information"
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  )
}

export default AccountCreation
