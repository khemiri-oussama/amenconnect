"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { IonIcon, IonInput, IonSelect, IonSelectOption, IonButton } from "@ionic/react"
import { motion } from "framer-motion"
import { calendarOutline, checkmarkCircleOutline, alertCircleOutline } from "ionicons/icons"
import { useAuth } from "../../../AuthContext"
import { useBeneficiaries } from "../../../hooks/useBeneficiaries"
import useVirementProgramme from "../../../hooks/useVirementProgramme"

interface VirementProgrammesMobileProps {
  onSuccess?: () => void
}

const VirementProgrammesMobile: React.FC<VirementProgrammesMobileProps> = ({ onSuccess }) => {
  const { profile } = useAuth()
  const { beneficiaires } = useBeneficiaries()
  const { loading, error, response, makeVirementProgramme } = useVirementProgramme()

  const [compteSource, setCompteSource] = useState("")
  const [beneficiaireId, setBeneficiaireId] = useState("")
  const [montant, setMontant] = useState<number | null>(null)
  const [motif, setMotif] = useState("")
  const [frequence, setFrequence] = useState("mensuel")
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Set default dates
    const today = new Date()
    const nextYear = new Date()
    nextYear.setFullYear(today.getFullYear() + 1)

    setDateDebut(today.toISOString().split("T")[0])
    setDateFin(nextYear.toISOString().split("T")[0])

    if (profile && profile.comptes && profile.comptes.length > 0) {
      setCompteSource(profile.comptes[0]._id)
    }
  }, [profile])

  useEffect(() => {
    if (beneficiaires.length > 0) {
      setBeneficiaireId(beneficiaires[0]._id)
    }
  }, [beneficiaires])

  useEffect(() => {
    if (response?.success) {
      setSuccess(true)

      // Reset after success
      setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 3000)
    }
  }, [response, onSuccess])

  const handleSubmit = async () => {
    if (!compteSource || !beneficiaireId || !montant || !dateDebut || !dateFin || !frequence) {
      return
    }

    if (montant <= 0) {
      return
    }

    const startDate = new Date(dateDebut)
    const endDate = new Date(dateFin)
    if (startDate >= endDate) {
      return
    }

    const selectedBeneficiaire = beneficiaires.find((b) => b._id === beneficiaireId)
    if (!selectedBeneficiaire) return

    const payload = {
      fromAccount: compteSource,
      toAccount: selectedBeneficiaire.RIB,
      amount: montant,
      description: motif,
      frequency: frequence as "quotidien" | "hebdomadaire" | "mensuel" | "trimestriel" | "annuel",
      startDate: dateDebut,
      endDate: dateFin,
    }

    await makeVirementProgramme(payload)
  }

  const calculateOccurrences = () => {
    if (!dateDebut || !dateFin || !frequence) return 0

    const start = new Date(dateDebut)
    const end = new Date(dateFin)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    switch (frequence) {
      case "quotidien":
        return diffDays
      case "hebdomadaire":
        return Math.floor(diffDays / 7)
      case "mensuel":
        return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth()
      case "trimestriel":
        return Math.floor(((end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth()) / 3)
      case "annuel":
        return end.getFullYear() - start.getFullYear()
      default:
        return 0
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const occurrences = calculateOccurrences()
  const totalAmount = (montant || 0) * occurrences

  if (success) {
    return (
      <motion.div
        className="success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="success-icon">
          <IonIcon icon={checkmarkCircleOutline} />
        </div>
        <h3 className="success-title">Virement programmé avec succès</h3>
        <p className="success-message">
          Votre virement programmé a été enregistré avec succès. Un email de confirmation vous a été envoyé.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="virement-programmes-mobile">
      {error && (
        <div className="error-message">
          <IonIcon icon={alertCircleOutline} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Compte source</label>
        <IonSelect
          className="form-select"
          value={compteSource}
          placeholder="Sélectionner un compte"
          onIonChange={(e) => setCompteSource(e.detail.value)}
        >
          {profile?.comptes?.map((compte) => (
            <IonSelectOption key={compte._id} value={compte._id}>
              {compte.type} - {compte.numéroCompte} ({compte.solde} TND)
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>

      <div className="form-group">
        <label className="form-label">Bénéficiaire</label>
        <IonSelect
          className="form-select"
          value={beneficiaireId}
          placeholder="Sélectionner un bénéficiaire"
          onIonChange={(e) => setBeneficiaireId(e.detail.value)}
        >
          {beneficiaires.map((ben) => (
            <IonSelectOption key={ben._id} value={ben._id}>
              {ben.prenom} {ben.nom} - {ben.RIB}
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>

      <div className="form-group">
        <label className="form-label">Montant (TND)</label>
        <IonInput
          type="number"
          className="form-input"
          value={montant}
          placeholder="0.00"
          onIonChange={(e) => setMontant(Number.parseFloat(e.detail.value || "0"))}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Motif (optionnel)</label>
        <IonInput
          className="form-input"
          value={motif}
          placeholder="Motif du virement"
          onIonChange={(e) => setMotif(e.detail.value || "")}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Fréquence</label>
        <IonSelect className="form-select" value={frequence} onIonChange={(e) => setFrequence(e.detail.value)}>
          <IonSelectOption value="quotidien">Quotidienne</IonSelectOption>
          <IonSelectOption value="hebdomadaire">Hebdomadaire</IonSelectOption>
          <IonSelectOption value="mensuel">Mensuelle</IonSelectOption>
          <IonSelectOption value="trimestriel">Trimestrielle</IonSelectOption>
          <IonSelectOption value="annuel">Annuelle</IonSelectOption>
        </IonSelect>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date de début</label>
          <IonInput
            type="date"
            className="form-input"
            value={dateDebut}
            onIonChange={(e) => setDateDebut(e.detail.value || "")}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date de fin</label>
          <IonInput
            type="date"
            className="form-input"
            value={dateFin}
            onIonChange={(e) => setDateFin(e.detail.value || "")}
          />
        </div>
      </div>

      <div className="schedule-summary">
        <div className="summary-header">
          <IonIcon icon={calendarOutline} />
          <h4>Résumé de la programmation</h4>
        </div>
        <div className="summary-content">
          <div className="summary-item">
            <span className="summary-label">Nombre d'occurrences:</span>
            <span className="summary-value">{occurrences}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Montant par virement:</span>
            <span className="summary-value">{montant ? formatCurrency(montant) : "0 TND"}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Montant total:</span>
            <span className="summary-value">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      <IonButton
        expand="block"
        className="submit-button"
        onClick={handleSubmit}
        disabled={loading || !compteSource || !beneficiaireId || !montant || montant <= 0 || !dateDebut || !dateFin}
      >
        Programmer le virement
      </IonButton>
    </div>
  )
}

export default VirementProgrammesMobile

