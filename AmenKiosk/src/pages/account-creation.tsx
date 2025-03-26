"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonCheckbox,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonRippleEffect,
  IonSpinner,
  IonProgressBar,
  IonAlert,
  IonBadge,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  timeOutline,
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
} from "ionicons/icons"
import "./account-creation.css"

const AccountCreation: React.FC = () => {
  const history = useHistory()
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [formProgress, setFormProgress] = useState(33)
  const [formComplete, setFormComplete] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

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
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight)
    }

    // Update time every 30 seconds
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 30000)

    // Add entrance animation class after component mounts
    const timer = setTimeout(() => {
      setPageLoaded(true)
    }, 100)

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearInterval(timeInterval)
      clearTimeout(timer)
    }
  }, [])

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

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }
    return date.toLocaleDateString("fr-FR", options)
  }

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
          "Votre mot de passe est trop faible. Utilisez au moins 8 caractères avec des lettres majuscules, des chiffres et des caractères spéciaux.",
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

      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    }, 800)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)

    // Scroll to top when changing steps
    window.scrollTo(0, 0)
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
    }, 2000)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleBack = () => {
    setPageLoaded(false)

    setTimeout(() => {
      history.push("/home")
    }, 300)
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding-0">
        <div className="app-container">
          <div className="background-pattern"></div>

          <div className="top-section">
            <div className="date-time">
              <IonIcon icon={timeOutline} />
              <span>{formatDate(currentTime)}</span>
            </div>

            <div className="logo-container">
              <div className="bank-logo">
                <IonImg src="amen_logo.png" alt="AmenBank Logo" />
              </div>
            </div>
          </div>

          <div className="account-content">
            {formComplete ? (
              <div className="success-card">
                <div className="success-icon">
                  <IonIcon icon={checkmarkCircleOutline} />
                </div>
                <h2>Compte créé avec succès!</h2>
                <p>Votre compte a été créé avec succès. Vous allez être redirigé vers la page d'accueil.</p>
                <IonProgressBar type="indeterminate" color="success"></IonProgressBar>
              </div>
            ) : (
              <div className={`account-card ${pageLoaded ? "show-card" : "hide-card"}`}>
                <div className="page-header">
                  <IonButton className="back-button-top" fill="clear" onClick={handleBack}>
                    <IonIcon icon={arrowBackOutline} slot="start" />
                    Retour
                  </IonButton>
                  <h1 className="page-title">Créer un compte</h1>
                  <div className="title-accent"></div>
                  <p className="page-subtitle">Rejoignez AmenBank en quelques étapes</p>
                </div>

                <div className="progress-container">
                  <IonProgressBar value={formProgress / 100} color="success"></IonProgressBar>
                  <div className="progress-text">{formProgress}% complété</div>
                </div>

                <div className="steps-indicator">
                  <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Informations personnelles</div>
                  </div>
                  <div className="step-connector"></div>
                  <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Sécurité</div>
                  </div>
                  <div className="step-connector"></div>
                  <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Confirmation</div>
                  </div>
                </div>

                <form className="account-form" onSubmit={handleSubmit}>
                  {currentStep === 1 && (
                    <div className="form-step">
                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={personOutline} />
                        </div>
                        <IonItem className="form-item">
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

                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={personOutline} />
                        </div>
                        <IonItem className="form-item">
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

                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={mailOutline} />
                        </div>
                        <IonItem className="form-item">
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

                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={callOutline} />
                        </div>
                        <IonItem className="form-item">
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

                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={calendarOutline} />
                        </div>
                        <IonItem className="form-item">
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

                      <div className="form-actions">
                        <IonButton className="next-button" onClick={nextStep} disabled={isLoading}>
                          {isLoading ? <IonSpinner name="crescent" /> : "Suivant"}
                          <IonRippleEffect />
                        </IonButton>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="form-step">
                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={idCardOutline} />
                        </div>
                        <IonItem className="form-item">
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

                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={idCardOutline} />
                        </div>
                        <IonItem className="form-item">
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

                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={lockClosedOutline} />
                        </div>
                        <IonItem className="form-item">
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
                        <div className="password-toggle" onClick={togglePasswordVisibility}>
                          <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                        </div>

                        {password && (
                          <div className="password-strength">
                            <div className="strength-bar">
                              <div
                                className={`strength-indicator ${
                                  passwordStrength < 50 ? "weak" : passwordStrength < 100 ? "medium" : "strong"
                                }`}
                                style={{ width: `${passwordStrength}%` }}
                              ></div>
                            </div>
                            <div className="strength-text">
                              {passwordFeedback}
                              {passwordStrength >= 100 && (
                                <IonBadge color="success" className="strength-badge">
                                  Sécurisé
                                </IonBadge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <div className="input-icon">
                          <IonIcon icon={lockClosedOutline} />
                        </div>
                        <IonItem className="form-item">
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
                        <div className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
                          <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
                        </div>

                        {confirmPassword && password !== confirmPassword && (
                          <div className="password-mismatch">Les mots de passe ne correspondent pas</div>
                        )}

                        {confirmPassword && password === confirmPassword && password.length > 0 && (
                          <div className="password-match">
                            Les mots de passe correspondent
                            <IonIcon icon={checkmarkCircleOutline} />
                          </div>
                        )}
                      </div>

                      <div className="form-actions">
                        <IonButton className="back-button" fill="outline" onClick={prevStep} disabled={isLoading}>
                          Retour
                          <IonRippleEffect />
                        </IonButton>
                        <IonButton className="next-button" onClick={nextStep} disabled={isLoading}>
                          {isLoading ? <IonSpinner name="crescent" /> : "Suivant"}
                          <IonRippleEffect />
                        </IonButton>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="form-step">
                      <div className="summary-section">
                        <h3>Résumé de vos informations</h3>
                        <div className="summary-grid">
                          <div className="summary-item">
                            <div className="summary-label">Nom complet</div>
                            <div className="summary-value">
                              {firstName} {lastName}
                            </div>
                          </div>
                          <div className="summary-item">
                            <div className="summary-label">Email</div>
                            <div className="summary-value">{email}</div>
                          </div>
                          <div className="summary-item">
                            <div className="summary-label">Téléphone</div>
                            <div className="summary-value">{phone}</div>
                          </div>
                          <div className="summary-item">
                            <div className="summary-label">Date de naissance</div>
                            <div className="summary-value">{birthdate}</div>
                          </div>
                          <div className="summary-item">
                            <div className="summary-label">Pièce d'identité</div>
                            <div className="summary-value">
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

                      <div className="terms-section">
                        <div className="terms-checkbox">
                          <IonCheckbox
                            checked={agreeTerms}
                            onIonChange={(e) => setAgreeTerms(e.detail.checked)}
                            required
                            disabled={isLoading}
                          />
                          <IonLabel>
                            J'accepte les <a href="#">conditions générales</a> et la{" "}
                            <a href="#">politique de confidentialité</a>
                          </IonLabel>
                        </div>
                      </div>

                      <div className="form-actions">
                        <IonButton className="back-button" fill="outline" onClick={prevStep} disabled={isLoading}>
                          Retour
                          <IonRippleEffect />
                        </IonButton>
                        <IonButton className="submit-button" type="submit" disabled={!agreeTerms || isLoading}>
                          {isLoading ? <IonSpinner name="crescent" /> : "Créer mon compte"}
                          <IonRippleEffect />
                        </IonButton>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}

            <div className={`security-note ${pageLoaded ? "show-note" : ""}`}>
              <div className="security-icon">
                <IonIcon icon={shieldCheckmarkOutline} />
              </div>
              <p>Vos données sont sécurisées et ne seront jamais partagées avec des tiers</p>
            </div>
          </div>

          <footer className="app-footer">
            <div className="footer-content">© 2024 AmenBank. Tous droits réservés.</div>
          </footer>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Information"
        message={alertMessage}
        buttons={["OK"]}
      />
    </IonPage>
  )
}

export default AccountCreation

