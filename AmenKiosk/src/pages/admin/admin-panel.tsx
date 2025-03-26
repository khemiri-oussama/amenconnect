"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAlert,
  IonToast,
  IonSpinner,
  IonToggle,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonList,
  IonListHeader,
  IonNote,
  IonRange,
  IonChip,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react"
import { useHistory } from "react-router-dom"
import {
  colorPaletteOutline,
  imageOutline,
  saveOutline,
  refreshOutline,
  eyeOutline,
  lockClosedOutline,
  volumeHighOutline,
  arrowBackOutline,
  settingsOutline,
  contrastOutline,
} from "ionicons/icons"
import { useTheme, type KioskTheme } from "../../context/ThemeContext"
import "./admin-panel.css"

// Color picker component
const ColorPicker: React.FC<{
  label: string
  color: string
  onChange: (color: string) => void
}> = ({ label, color, onChange }) => {
  return (
    <div className="admin-color-picker">
      <div className="admin-color-label">{label}</div>
      <div className="admin-color-input-container">
        <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="admin-color-input" />
        <input type="text" value={color} onChange={(e) => onChange(e.target.value)} className="admin-color-text" />
      </div>
    </div>
  )
}

// Logo uploader component
const LogoUploader: React.FC<{
  currentLogo: string
  onLogoChange: (logo: string) => void
}> = ({ currentLogo, onLogoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onLogoChange(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="admin-logo-uploader">
      <div className="admin-logo-preview">
        <img src={currentLogo || "/placeholder.svg"} alt="Logo" />
      </div>
      <div className="admin-logo-controls">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <IonButton expand="block" onClick={() => fileInputRef.current?.click()} className="admin-upload-button">
          <IonIcon icon={imageOutline} slot="start" />
          Changer le logo
        </IonButton>
        <IonNote>Format recommandé: PNG avec fond transparent, 200x60px</IonNote>
      </div>
    </div>
  )
}

// Main admin panel component
const AdminPanel: React.FC = () => {
  const { theme, updateTheme, resetTheme, applyTheme } = useTheme()
  const history = useHistory()
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showResetAlert, setShowResetAlert] = useState(false)
  const [showExitAlert, setShowExitAlert] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("colors")
  const [previewMode, setPreviewMode] = useState(false)
  const [tempTheme, setTempTheme] = useState<KioskTheme>({ ...theme })
  const [soundVolume, setSoundVolume] = useState(50)

  // Update temp theme when main theme changes
  useEffect(() => {
    setTempTheme({ ...theme })
  }, [theme])

  // Handle color change
  const handleColorChange = (key: keyof KioskTheme, value: string) => {
    setTempTheme((prev) => ({ ...prev, [key]: value }))
  }

  // Handle logo change
  const handleLogoChange = (logoUrl: string) => {
    setTempTheme((prev) => ({ ...prev, logoUrl }))
  }

  // Handle background gradient change
  const handleGradientChange = () => {
    const gradient = `linear-gradient(135deg, ${tempTheme.backgroundColor} 0%, ${tempTheme.primaryBlueDark} 100%)`
    setTempTheme((prev) => ({ ...prev, backgroundGradient: gradient }))
  }

  // Apply changes
  const applyChanges = () => {
    setIsSaving(true)

    // Simulate API call or processing
    setTimeout(() => {
      updateTheme(tempTheme)
      applyTheme()
      setIsSaving(false)
      setToastMessage("Modifications enregistrées avec succès")
      setShowToast(true)
    }, 800)
  }

  // Reset to defaults
  const handleReset = () => {
    resetTheme()
    setTempTheme({ ...theme })
    setToastMessage("Thème réinitialisé aux valeurs par défaut")
    setShowToast(true)
  }

  // Toggle preview mode
  const togglePreview = () => {
    if (previewMode) {
      // Exit preview mode, restore original theme
      applyTheme()
    } else {
      // Enter preview mode, apply temp theme
      const root = document.documentElement

      // Apply colors from temp theme
      root.style.setProperty("--primary-blue", tempTheme.primaryBlue)
      root.style.setProperty("--primary-blue-dark", tempTheme.primaryBlueDark)
      root.style.setProperty("--primary-blue-light", tempTheme.primaryBlueLight)
      root.style.setProperty("--primary-green", tempTheme.primaryGreen)
      root.style.setProperty("--primary-green-dark", tempTheme.primaryGreenDark)
      root.style.setProperty("--primary-green-light", tempTheme.primaryGreenLight)
      root.style.setProperty("--primary-yellow", tempTheme.primaryYellow)
      root.style.setProperty("--primary-yellow-dark", tempTheme.primaryYellowDark)
      root.style.setProperty("--primary-yellow-light", tempTheme.primaryYellowLight)

      // Apply background
      const kioskBackgrounds = document.querySelectorAll(".kiosk-background")
      kioskBackgrounds.forEach((bg: Element) => {
        if (bg instanceof HTMLElement) {
          bg.style.background = tempTheme.backgroundGradient
        }
      })
    }

    setPreviewMode(!previewMode)
  }

  // Exit admin panel
  const exitAdmin = () => {
    history.push("/home")
  }

  return (
    <IonPage className="admin-page">
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonButton onClick={() => setShowExitAlert(true)}>
              <IonIcon icon={arrowBackOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Panneau d'administration</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={togglePreview}>
              <IonIcon icon={eyeOutline} slot="start" />
              {previewMode ? "Quitter l'aperçu" : "Aperçu"}
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={activeTab} onIonChange={(e) => setActiveTab(e.detail.value as string)}>
            <IonSegmentButton value="colors">
              <IonIcon icon={colorPaletteOutline} />
              <IonLabel>Couleurs</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="logo">
              <IonIcon icon={imageOutline} />
              <IonLabel>Logo</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="settings">
              <IonIcon icon={settingsOutline} />
              <IonLabel>Paramètres</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="admin-content">
        <div className="admin-container">
          {activeTab === "colors" && (
            <IonCard className="admin-card">
              <IonCardHeader>
                <IonCardTitle>Personnalisation des couleurs</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonGrid>
                  <IonRow>
                    <IonCol size="12" sizeMd="4">
                      <IonListHeader>Couleurs primaires</IonListHeader>
                      <ColorPicker
                        label="Bleu principal"
                        color={tempTheme.primaryBlue}
                        onChange={(color) => handleColorChange("primaryBlue", color)}
                      />
                      <ColorPicker
                        label="Bleu foncé"
                        color={tempTheme.primaryBlueDark}
                        onChange={(color) => handleColorChange("primaryBlueDark", color)}
                      />
                      <ColorPicker
                        label="Bleu clair"
                        color={tempTheme.primaryBlueLight}
                        onChange={(color) => handleColorChange("primaryBlueLight", color)}
                      />
                    </IonCol>

                    <IonCol size="12" sizeMd="4">
                      <IonListHeader>Couleurs secondaires</IonListHeader>
                      <ColorPicker
                        label="Vert principal"
                        color={tempTheme.primaryGreen}
                        onChange={(color) => handleColorChange("primaryGreen", color)}
                      />
                      <ColorPicker
                        label="Vert foncé"
                        color={tempTheme.primaryGreenDark}
                        onChange={(color) => handleColorChange("primaryGreenDark", color)}
                      />
                      <ColorPicker
                        label="Vert clair"
                        color={tempTheme.primaryGreenLight}
                        onChange={(color) => handleColorChange("primaryGreenLight", color)}
                      />
                    </IonCol>

                    <IonCol size="12" sizeMd="4">
                      <IonListHeader>Couleurs d'accent</IonListHeader>
                      <ColorPicker
                        label="Jaune principal"
                        color={tempTheme.primaryYellow}
                        onChange={(color) => handleColorChange("primaryYellow", color)}
                      />
                      <ColorPicker
                        label="Jaune foncé"
                        color={tempTheme.primaryYellowDark}
                        onChange={(color) => handleColorChange("primaryYellowDark", color)}
                      />
                      <ColorPicker
                        label="Jaune clair"
                        color={tempTheme.primaryYellowLight}
                        onChange={(color) => handleColorChange("primaryYellowLight", color)}
                      />
                    </IonCol>
                  </IonRow>

                  <IonRow>
                    <IonCol size="12">
                      <IonListHeader>Arrière-plan</IonListHeader>
                      <div className="admin-background-settings">
                        <ColorPicker
                          label="Couleur de fond"
                          color={tempTheme.backgroundColor}
                          onChange={(color) => {
                            handleColorChange("backgroundColor", color)
                            // Update gradient when background color changes
                            setTimeout(() => handleGradientChange(), 100)
                          }}
                        />
                        <div className="admin-gradient-preview" style={{ background: tempTheme.backgroundGradient }}>
                          <span>Aperçu du dégradé</span>
                        </div>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          )}

          {activeTab === "logo" && (
            <IonCard className="admin-card">
              <IonCardHeader>
                <IonCardTitle>Personnalisation du logo</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <LogoUploader currentLogo={tempTheme.logoUrl} onLogoChange={handleLogoChange} />
              </IonCardContent>
            </IonCard>
          )}

          {activeTab === "settings" && (
            <IonCard className="admin-card">
              <IonCardHeader>
                <IonCardTitle>Paramètres généraux</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonIcon icon={volumeHighOutline} slot="start" />
                    <IonLabel>
                      <h2>Volume des sons</h2>
                      <p>Ajustez le volume des effets sonores</p>
                    </IonLabel>
                    <IonRange
                      min={0}
                      max={100}
                      step={1}
                      value={soundVolume}
                      onIonChange={(e) => setSoundVolume(e.detail.value as number)}
                    >
                      <IonIcon slot="start" icon={volumeHighOutline} size="small" />
                      <IonIcon slot="end" icon={volumeHighOutline} />
                    </IonRange>
                  </IonItem>

                  <IonItem>
                    <IonIcon icon={contrastOutline} slot="start" />
                    <IonLabel>
                      <h2>Mode contraste élevé</h2>
                      <p>Améliore la lisibilité pour les utilisateurs malvoyants</p>
                    </IonLabel>
                    <IonToggle />
                  </IonItem>

                  <IonItem>
                    <IonIcon icon={lockClosedOutline} slot="start" />
                    <IonLabel>
                      <h2>Mot de passe administrateur</h2>
                      <p>Modifier le mot de passe d'accès</p>
                    </IonLabel>
                    <IonButton fill="outline" size="small">
                      Modifier
                    </IonButton>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          <div className="admin-actions">
            <IonButton
              expand="block"
              onClick={() => setShowResetAlert(true)}
              color="medium"
              className="admin-reset-button"
            >
              <IonIcon icon={refreshOutline} slot="start" />
              Réinitialiser
            </IonButton>

            <IonButton
              expand="block"
              onClick={applyChanges}
              color="primary"
              className="admin-save-button"
              disabled={isSaving}
            >
              {isSaving ? (
                <IonSpinner name="dots" />
              ) : (
                <>
                  <IonIcon icon={saveOutline} slot="start" />
                  Enregistrer les modifications
                </>
              )}
            </IonButton>
          </div>
        </div>

        {/* Preview mode indicator */}
        {previewMode && (
          <div className="admin-preview-indicator">
            <IonChip color="warning">
              <IonIcon icon={eyeOutline} />
              <IonLabel>Mode aperçu</IonLabel>
            </IonChip>
          </div>
        )}
      </IonContent>

      {/* Reset confirmation alert */}
      <IonAlert
        isOpen={showResetAlert}
        onDidDismiss={() => setShowResetAlert(false)}
        header="Réinitialiser le thème"
        message="Êtes-vous sûr de vouloir réinitialiser toutes les couleurs et le logo aux valeurs par défaut? Cette action est irréversible."
        buttons={[
          {
            text: "Annuler",
            role: "cancel",
          },
          {
            text: "Réinitialiser",
            handler: handleReset,
          },
        ]}
      />

      {/* Exit confirmation alert */}
      <IonAlert
        isOpen={showExitAlert}
        onDidDismiss={() => setShowExitAlert(false)}
        header="Quitter l'administration"
        message="Êtes-vous sûr de vouloir quitter? Les modifications non enregistrées seront perdues."
        buttons={[
          {
            text: "Annuler",
            role: "cancel",
          },
          {
            text: "Quitter",
            handler: exitAdmin,
          },
        ]}
      />

      {/* Toast notification */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
        position="bottom"
        color="success"
      />
    </IonPage>
  )
}

export default AdminPanel

