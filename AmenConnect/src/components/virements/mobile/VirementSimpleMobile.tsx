"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { IonIcon, IonInput, IonSelect, IonSelectOption, IonButton } from "@ionic/react"
import { motion, AnimatePresence } from "framer-motion"
import { timeOutline, arrowForwardOutline, checkmarkCircleOutline, alertCircleOutline } from "ionicons/icons"
import { useAuth } from "../../../AuthContext"
import useVirement from "../../../hooks/useVirement"
import { useBeneficiaries } from "../../../hooks/useBeneficiaries"

interface VirementSimpleMobileProps {
  onSuccess?: () => void
}

const VirementSimpleMobile: React.FC<VirementSimpleMobileProps> = ({ onSuccess }) => {
  const { profile } = useAuth()
  const { beneficiaires } = useBeneficiaries()
  const { loading, error, response, makeVirement } = useVirement()

  const [compteSource, setCompteSource] = useState("")
  const [beneficiaireId, setBeneficiaireId] = useState("")
  const [montant, setMontant] = useState<number | null>(null)
  const [motif, setMotif] = useState("")
  const [animationState, setAnimationState] = useState<"idle" | "loading" | "success">("idle")

  useEffect(() => {
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
    if (loading) {
      setAnimationState("loading")
    } else if (response?.success) {
      setAnimationState("success")

      // Keep success state visible for 3 seconds
      const timer = setTimeout(() => {
        if (onSuccess) onSuccess()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [loading, response, onSuccess])

  const handleSubmit = async () => {
    if (!compteSource || !beneficiaireId || !montant || montant <= 0) {
      return
    }

    const selectedBeneficiaire = beneficiaires.find((b) => b._id === beneficiaireId)
    if (!selectedBeneficiaire) return

    const virementData = {
      fromAccount: compteSource,
      toAccount: selectedBeneficiaire.RIB,
      amount: montant,
      description: motif,
    }

    await makeVirement(virementData)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const selectedCompte = profile?.comptes?.find((compte) => compte._id === compteSource)
  const selectedBeneficiaire = beneficiaires.find((ben) => ben._id === beneficiaireId)

  return (
    <div className="virement-simple-mobile">
      <AnimatePresence mode="wait">
        {animationState === "loading" || animationState === "success" ? (
          <motion.div
            key="processing"
            className="processing-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="processing-animation"
              initial={{ scale: 1 }}
              animate={{
                scale: animationState === "success" ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: 0,
              }}
            >
              {animationState === "loading" ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <IonIcon icon={timeOutline} className="processing-icon" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <IonIcon icon={checkmarkCircleOutline} className="processing-icon success" />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="processing-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="processing-title">
                {animationState === "loading" ? "Traitement en cours..." : "Virement réussi!"}
              </h3>
              <p className="processing-description">
                {animationState === "loading"
                  ? "Veuillez patienter pendant que nous traitons votre virement."
                  : "Votre virement a été traité avec succès."}
              </p>

              {animationState === "loading" && (
                <motion.div
                  className="processing-progress"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2 }}
                />
              )}

              {selectedCompte && selectedBeneficiaire && (
                <motion.div
                  className="transfer-details"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="transfer-account">
                    <span className="transfer-account-name">{selectedCompte.type}</span>
                    <span className="transfer-account-number">{selectedCompte.numéroCompte}</span>
                  </div>

                  <motion.div
                    className="transfer-arrow"
                    animate={{
                      x: [0, 10, 0],
                      opacity: animationState === "loading" ? [0.5, 1, 0.5] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: animationState === "loading" ? Number.POSITIVE_INFINITY : 0,
                      repeatType: "reverse",
                    }}
                  >
                    <IonIcon icon={arrowForwardOutline} />
                  </motion.div>

                  <div className="transfer-account">
                    <span className="transfer-account-name">
                      {selectedBeneficiaire.prenom} {selectedBeneficiaire.nom}
                    </span>
                    <span className="transfer-account-number">{selectedBeneficiaire.RIB}</span>
                  </div>
                </motion.div>
              )}

              <motion.div
                className="transfer-amount"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {montant ? formatCurrency(montant) : "0 TND"}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="form-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
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

            <IonButton
              expand="block"
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading || !compteSource || !beneficiaireId || !montant || montant <= 0}
            >
              Valider le virement
            </IonButton>

            {selectedCompte && selectedBeneficiaire && (
              <div className="transfer-summary">
                <div className="summary-item">
                  <span className="summary-label">De:</span>
                  <span className="summary-value">{selectedCompte.type}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">À:</span>
                  <span className="summary-value">
                    {selectedBeneficiaire.prenom} {selectedBeneficiaire.nom}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Montant:</span>
                  <span className="summary-value">{montant ? formatCurrency(montant) : "0 TND"}</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VirementSimpleMobile

