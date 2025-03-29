"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { IonIcon } from "@ionic/react"
import {
  calendarOutline,
  walletOutline,
  personOutline,
  cashOutline,
  repeatOutline,
  timeOutline,
  checkmarkCircleOutline,
} from "ionicons/icons"
import { useAuth } from "../../../AuthContext"

interface Compte {
  _id: string
  numéroCompte: string
  solde: number
  type: string
}

interface Beneficiaire {
  _id: string
  nom: string
  prenom: string
  numeroCompte: string
  banque: string
}

const VirementsProgrammes: React.FC = () => {
  const { profile } = useAuth()
  const [comptes, setComptes] = useState<Compte[]>([])
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([])
  const [compteSource, setCompteSource] = useState("")
  const [beneficiaire, setBeneficiaire] = useState("")
  const [montant, setMontant] = useState("")
  const [motif, setMotif] = useState("")
  const [frequence, setFrequence] = useState("mensuel")
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Set default dates
    const today = new Date()
    const nextMonth = new Date()
    nextMonth.setMonth(today.getMonth() + 1)

    const nextYear = new Date()
    nextYear.setFullYear(today.getFullYear() + 1)

    setDateDebut(today.toISOString().split("T")[0])
    setDateFin(nextYear.toISOString().split("T")[0])

    // Fetch accounts from profile
    if (profile && profile.comptes) {
      setComptes(profile.comptes)
      if (profile.comptes.length > 0) {
        setCompteSource(profile.comptes[0]._id)
      }
    }

    // Fetch beneficiaries
    const fetchBeneficiaires = async () => {
      try {
        // This would be replaced with an actual API call
        const mockBeneficiaires = [
          { _id: "b1", nom: "Dupont", prenom: "Jean", numeroCompte: "TN5910000123456789", banque: "Banque Nationale" },
          { _id: "b2", nom: "Martin", prenom: "Sophie", numeroCompte: "TN5910000987654321", banque: "Banque Centrale" },
          { _id: "b3", nom: "Trabelsi", prenom: "Ahmed", numeroCompte: "TN5910000567891234", banque: "Banque du Sud" },
        ]
        setBeneficiaires(mockBeneficiaires)
        if (mockBeneficiaires.length > 0) {
          setBeneficiaire(mockBeneficiaires[0]._id)
        }
      } catch (error) {
        console.error("Error fetching beneficiaries:", error)
      }
    }

    fetchBeneficiaires()
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      // Validate form
      if (!compteSource || !beneficiaire || !montant || !dateDebut || !dateFin || !frequence) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      if (Number.parseFloat(montant) <= 0) {
        throw new Error("Le montant doit être supérieur à 0")
      }

      const startDate = new Date(dateDebut)
      const endDate = new Date(dateFin)

      if (startDate >= endDate) {
        throw new Error("La date de fin doit être postérieure à la date de début")
      }

      // This would be replaced with an actual API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form and show success message
      setMontant("")
      setMotif("")
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors de la programmation de votre virement")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getFrequenceLabel = (freq: string) => {
    switch (freq) {
      case "quotidien":
        return "Quotidienne"
      case "hebdomadaire":
        return "Hebdomadaire"
      case "mensuel":
        return "Mensuelle"
      case "trimestriel":
        return "Trimestrielle"
      case "annuel":
        return "Annuelle"
      default:
        return freq
    }
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

  const selectedCompte = comptes.find((compte) => compte._id === compteSource)
  const selectedBeneficiaire = beneficiaires.find((ben) => ben._id === beneficiaire)
  const occurrences = calculateOccurrences()
  const totalAmount = occurrences * Number.parseFloat(montant || "0")

  return (
    <div className="virements-programmes">
      <div className="virement-grid virement-grid--2cols">
        <div className="virement-card">
          <h3 className="virement-card__title">
            <IonIcon icon={calendarOutline} />
            Programmer un virement
          </h3>

          {success && (
            <div className="virement-success">
              <div className="virement-success__icon">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
              <h4 className="virement-success__title">Virement programmé avec succès</h4>
              <p className="virement-success__message">
                Votre virement programmé a été enregistré avec succès. Un email de confirmation vous a été envoyé.
              </p>
              <button className="virement-form__button" onClick={() => setSuccess(false)}>
                Programmer un autre virement
              </button>
            </div>
          )}

          {!success && (
            <form className="virement-form" onSubmit={handleSubmit}>
              {error && <div className="virement-form__error">{error}</div>}

              <div className="virement-form__group">
                <label className="virement-form__label" htmlFor="compteSource">
                  Compte source
                </label>
                <select
                  id="compteSource"
                  className="virement-form__select"
                  value={compteSource}
                  onChange={(e) => setCompteSource(e.target.value)}
                  required
                >
                  {comptes.map((compte) => (
                    <option key={compte._id} value={compte._id}>
                      {compte.type} - {compte.numéroCompte} ({formatCurrency(compte.solde)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="virement-form__group">
                <label className="virement-form__label" htmlFor="beneficiaire">
                  Bénéficiaire
                </label>
                <select
                  id="beneficiaire"
                  className="virement-form__select"
                  value={beneficiaire}
                  onChange={(e) => setBeneficiaire(e.target.value)}
                  required
                >
                  {beneficiaires.map((ben) => (
                    <option key={ben._id} value={ben._id}>
                      {ben.prenom} {ben.nom} - {ben.numeroCompte}
                    </option>
                  ))}
                </select>
              </div>

              <div className="virement-form__group">
                <label className="virement-form__label" htmlFor="montant">
                  Montant (TND)
                </label>
                <input
                  id="montant"
                  type="number"
                  className="virement-form__input"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="virement-form__group">
                <label className="virement-form__label" htmlFor="motif">
                  Motif du virement
                </label>
                <textarea
                  id="motif"
                  className="virement-form__textarea"
                  value={motif}
                  onChange={(e) => setMotif(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="virement-form__group">
                <label className="virement-form__label" htmlFor="frequence">
                  Fréquence
                </label>
                <select
                  id="frequence"
                  className="virement-form__select"
                  value={frequence}
                  onChange={(e) => setFrequence(e.target.value)}
                  required
                >
                  <option value="quotidien">Quotidienne</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="mensuel">Mensuelle</option>
                  <option value="trimestriel">Trimestrielle</option>
                  <option value="annuel">Annuelle</option>
                </select>
              </div>

              <div className="virement-form__row">
                <div className="virement-form__group">
                  <label className="virement-form__label" htmlFor="dateDebut">
                    Date de début
                  </label>
                  <input
                    id="dateDebut"
                    type="date"
                    className="virement-form__input"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="virement-form__group">
                  <label className="virement-form__label" htmlFor="dateFin">
                    Date de fin
                  </label>
                  <input
                    id="dateFin"
                    type="date"
                    className="virement-form__input"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    min={dateDebut}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="virement-form__button" disabled={isSubmitting}>
                {isSubmitting ? "Traitement en cours..." : "Programmer le virement"}
              </button>
            </form>
          )}
        </div>

        <div className="virement-card">
          <h3 className="virement-card__title">
            <IonIcon icon={repeatOutline} />
            Résumé du virement programmé
          </h3>

          <div className="virement-recap">
            <div className="virement-recap__group">
              <h4 className="virement-recap__title">
                <IonIcon icon={walletOutline} />
                Compte source
              </h4>
              {selectedCompte ? (
                <div className="virement-recap__content">
                  <div className="virement-recap__item">
                    <span className="virement-recap__label">Type:</span>
                    <span className="virement-recap__value">{selectedCompte.type}</span>
                  </div>
                  <div className="virement-recap__item">
                    <span className="virement-recap__label">Numéro:</span>
                    <span className="virement-recap__value">{selectedCompte.numéroCompte}</span>
                  </div>
                  <div className="virement-recap__item">
                    <span className="virement-recap__label">Solde disponible:</span>
                    <span className="virement-recap__value">{formatCurrency(selectedCompte.solde)}</span>
                  </div>
                </div>
              ) : (
                <p className="virement-recap__empty">Aucun compte sélectionné</p>
              )}
            </div>

            <div className="virement-recap__group">
              <h4 className="virement-recap__title">
                <IonIcon icon={personOutline} />
                Bénéficiaire
              </h4>
              {selectedBeneficiaire ? (
                <div className="virement-recap__content">
                  <div className="virement-recap__item">
                    <span className="virement-recap__label">Nom:</span>
                    <span className="virement-recap__value">
                      {selectedBeneficiaire.prenom} {selectedBeneficiaire.nom}
                    </span>
                  </div>
                  <div className="virement-recap__item">
                    <span className="virement-recap__label">Compte:</span>
                    <span className="virement-recap__value">{selectedBeneficiaire.numeroCompte}</span>
                  </div>
                  <div className="virement-recap__item">
                    <span className="virement-recap__label">Banque:</span>
                    <span className="virement-recap__value">{selectedBeneficiaire.banque}</span>
                  </div>
                </div>
              ) : (
                <p className="virement-recap__empty">Aucun bénéficiaire sélectionné</p>
              )}
            </div>

            <div className="virement-recap__group">
              <h4 className="virement-recap__title">
                <IonIcon icon={cashOutline} />
                Détails du virement
              </h4>
              <div className="virement-recap__content">
                <div className="virement-recap__item">
                  <span className="virement-recap__label">Montant par virement:</span>
                  <span className="virement-recap__value">
                    {montant ? formatCurrency(Number.parseFloat(montant)) : "0,00 TND"}
                  </span>
                </div>
                <div className="virement-recap__item">
                  <span className="virement-recap__label">Motif:</span>
                  <span className="virement-recap__value">{motif || "Non spécifié"}</span>
                </div>
              </div>
            </div>

            <div className="virement-recap__group">
              <h4 className="virement-recap__title">
                <IonIcon icon={timeOutline} />
                Programmation
              </h4>
              <div className="virement-recap__content">
                <div className="virement-recap__item">
                  <span className="virement-recap__label">Fréquence:</span>
                  <span className="virement-recap__value">{getFrequenceLabel(frequence)}</span>
                </div>
                <div className="virement-recap__item">
                  <span className="virement-recap__label">Date de début:</span>
                  <span className="virement-recap__value">{formatDate(dateDebut)}</span>
                </div>
                <div className="virement-recap__item">
                  <span className="virement-recap__label">Date de fin:</span>
                  <span className="virement-recap__value">{formatDate(dateFin)}</span>
                </div>
                <div className="virement-recap__item">
                  <span className="virement-recap__label">Nombre d'occurrences:</span>
                  <span className="virement-recap__value">{occurrences}</span>
                </div>
                <div className="virement-recap__item">
                  <span className="virement-recap__label">Montant total:</span>
                  <span className="virement-recap__value">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirementsProgrammes

