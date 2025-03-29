"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { IonIcon } from "@ionic/react"
import { walletOutline, personOutline, cashOutline, documentTextOutline, checkmarkCircleOutline } from "ionicons/icons"
import { useAuth } from "../../../AuthContext"
import useVirement from "../../../hooks/useVirement"  // adjust the import path as needed

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

const VirementSimple: React.FC = () => {
  const { profile } = useAuth()
  const [comptes, setComptes] = useState<Compte[]>([])
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([])
  const [compteSource, setCompteSource] = useState("")
  const [beneficiaire, setBeneficiaire] = useState("")
  const [montant, setMontant] = useState("")
  const [motif, setMotif] = useState("")
  const [success, setSuccess] = useState(false)

  // Import our custom hook which handles virements
  const { loading, error, response, makeVirement } = useVirement()

  useEffect(() => {
    // Fetch accounts from profile
    if (profile && profile.comptes) {
      setComptes(profile.comptes)
      if (profile.comptes.length > 0) {
        setCompteSource(profile.comptes[0]._id)
      }
    }

    // Fetch beneficiaries (this is mocked; replace with your API call if needed)
    const fetchBeneficiaires = async () => {
      try {
        const mockBeneficiaires = [
          { _id: "67bd28b921c1fed19b865a16", nom: "Dupont", prenom: "Jean", numeroCompte: "183241033", banque: "Banque Nationale" },
          { _id: "63b2f1c0a2e8f2a123456790", nom: "Martin", prenom: "Sophie", numeroCompte: "TN5910000987654321", banque: "Banque Centrale" },
          { _id: "63b2f1c0a2e8f2a123456791", nom: "Trabelsi", prenom: "Ahmed", numeroCompte: "TN5910000567891234", banque: "Banque du Sud" },
        ];        
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
    
    // Basic validations
    if (!compteSource || !beneficiaire || !montant) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }
    if (Number.parseFloat(montant) <= 0) {
      alert("Le montant doit être supérieur à 0")
      return
    }
    
    // Create the virement payload
    const virementData = {
      fromAccount: compteSource,
      toAccount: beneficiaire,
      amount: Number.parseFloat(montant),
      description: motif,
    }
    
    // Call the hook to make the virement
    await makeVirement(virementData)
    
    // If the hook response indicates success, reset the form
    if (response?.success) {
      setMontant("")
      setMotif("")
      setSuccess(true)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount)
  }

  const selectedCompte = comptes.find((compte) => compte._id === compteSource)
  const selectedBeneficiaire = beneficiaires.find((ben) => ben._id === beneficiaire)

  return (
    <div className="virement-simple">
      <div className="virement-grid virement-grid--2cols">
        <div className="virement-card">
          <h3 className="virement-card__title">
            <IonIcon icon={walletOutline} />
            Effectuer un virement
          </h3>

          {success && (
            <div className="virement-success">
              <div className="virement-success__icon">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
              <h4 className="virement-success__title">Virement effectué avec succès</h4>
              <p className="virement-success__message">
                Votre virement a été traité avec succès. Un email de confirmation vous a été envoyé.
              </p>
              <button className="virement-form__button" onClick={() => setSuccess(false)}>
                Effectuer un autre virement
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
                  rows={3}
                />
              </div>

              <button type="submit" className="virement-form__button" disabled={loading}>
                {loading ? "Traitement en cours..." : "Effectuer le virement"}
              </button>
            </form>
          )}
        </div>

        <div className="virement-card">
          <h3 className="virement-card__title">
            <IonIcon icon={documentTextOutline} />
            Récapitulatif
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirementSimple
