"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { IonIcon } from "@ionic/react"
import { documentOutline, addCircleOutline, trashOutline, cloudUploadOutline } from "ionicons/icons"
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

interface VirementGroupe {
  beneficiaireId: string
  montant: string
  motif: string
}

const VirementsGroupes: React.FC = () => {
  const { profile } = useAuth()
  const [comptes, setComptes] = useState<Compte[]>([])
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([])
  const [compteSource, setCompteSource] = useState("")
  const [mode, setMode] = useState<"csv" | "manuel">("manuel")
  const [virements, setVirements] = useState<VirementGroupe[]>([{ beneficiaireId: "", montant: "", motif: "" }])
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
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
        setVirements([{ beneficiaireId: mockBeneficiaires[0]._id, montant: "", motif: "" }])
      } catch (error) {
        console.error("Error fetching beneficiaries:", error)
      }
    }

    fetchBeneficiaires()
  }, [profile])

  const handleAddVirement = () => {
    setVirements([...virements, { beneficiaireId: beneficiaires[0]?._id || "", montant: "", motif: "" }])
  }

  const handleRemoveVirement = (index: number) => {
    const newVirements = [...virements]
    newVirements.splice(index, 1)
    setVirements(newVirements)
  }

  const handleVirementChange = (index: number, field: keyof VirementGroupe, value: string) => {
    const newVirements = [...virements]
    newVirements[index][field] = value
    setVirements(newVirements)
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)

    // Parse CSV file
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const rows = text.split("\n")
      const headers = rows[0].split(",")

      const parsedData = rows
        .slice(1)
        .filter((row) => row.trim())
        .map((row) => {
          const values = row.split(",")
          const rowData: any = {}
          headers.forEach((header, index) => {
            rowData[header.trim()] = values[index]?.trim() || ""
          })
          return rowData
        })

      setCsvPreview(parsedData)
    }

    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      // Validate form
      if (!compteSource) {
        throw new Error("Veuillez sélectionner un compte source")
      }

      if (mode === "manuel") {
        // Validate manual entries
        const invalidEntries = virements.some(
          (v) => !v.beneficiaireId || !v.montant || Number.parseFloat(v.montant) <= 0,
        )
        if (invalidEntries) {
          throw new Error("Veuillez remplir correctement tous les champs pour chaque virement")
        }
      } else {
        // Validate CSV
        if (!csvFile || csvPreview.length === 0) {
          throw new Error("Veuillez importer un fichier CSV valide")
        }
      }

      // This would be replaced with an actual API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reset form and show success message
      if (mode === "csv") {
        setCsvFile(null)
        setCsvPreview([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        setVirements([{ beneficiaireId: beneficiaires[0]?._id || "", montant: "", motif: "" }])
      }

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue lors du traitement de vos virements")
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

  const selectedCompte = comptes.find((compte) => compte._id === compteSource)

  const totalAmount =
    mode === "manuel"
      ? virements.reduce((sum, v) => sum + (Number.parseFloat(v.montant) || 0), 0)
      : csvPreview.reduce((sum, row) => sum + (Number.parseFloat(row.amount) || 0), 0)

  return (
    <div className="virements-groupes">
      <div className="virement-card">
        <h3 className="virement-card__title">
          <IonIcon icon={documentOutline} />
          Virements groupés
        </h3>

        {success && (
          <div className="virement-success">
            <div className="virement-success__icon">
              <IonIcon icon={documentOutline} />
            </div>
            <h4 className="virement-success__title">Virements groupés effectués avec succès</h4>
            <p className="virement-success__message">
              Vos virements ont été traités avec succès. Un email de confirmation vous a été envoyé.
            </p>
            <button className="virement-form__button" onClick={() => setSuccess(false)}>
              Effectuer d'autres virements
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

            <div className="virement-form__tabs">
              <button
                type="button"
                className={`virement-form__tab ${mode === "manuel" ? "active" : ""}`}
                onClick={() => setMode("manuel")}
              >
                Saisie manuelle
              </button>
              <button
                type="button"
                className={`virement-form__tab ${mode === "csv" ? "active" : ""}`}
                onClick={() => setMode("csv")}
              >
                Import CSV
              </button>
            </div>

            {mode === "manuel" && (
              <div className="virement-form__manuel">
                {virements.map((virement, index) => (
                  <div key={index} className="virement-form__row">
                    <div className="virement-form__group">
                      <label className="virement-form__label">Bénéficiaire</label>
                      <select
                        className="virement-form__select"
                        value={virement.beneficiaireId}
                        onChange={(e) => handleVirementChange(index, "beneficiaireId", e.target.value)}
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
                      <label className="virement-form__label">Montant (TND)</label>
                      <input
                        type="number"
                        className="virement-form__input"
                        value={virement.montant}
                        onChange={(e) => handleVirementChange(index, "montant", e.target.value)}
                        min="0.01"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="virement-form__group">
                      <label className="virement-form__label">Motif</label>
                      <input
                        type="text"
                        className="virement-form__input"
                        value={virement.motif}
                        onChange={(e) => handleVirementChange(index, "motif", e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      className="virement-form__button virement-form__button--icon"
                      onClick={() => handleRemoveVirement(index)}
                      disabled={virements.length === 1}
                    >
                      <IonIcon icon={trashOutline} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="virement-form__button virement-form__button--secondary"
                  onClick={handleAddVirement}
                >
                  <IonIcon icon={addCircleOutline} />
                  Ajouter un bénéficiaire
                </button>
              </div>
            )}

            {mode === "csv" && (
              <div className="virement-form__csv">
                <div className="virement-form__group">
                  <label className="virement-form__label">Importer un fichier CSV</label>
                  <div className="virement-form__file-upload">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      ref={fileInputRef}
                      className="virement-form__file-input"
                    />
                    <div className="virement-form__file-button">
                      <IonIcon icon={cloudUploadOutline} />
                      <span>{csvFile ? csvFile.name : "Choisir un fichier"}</span>
                    </div>
                  </div>
                  <div className="virement-form__file-info">
                    Format du fichier CSV: name,accountNumber,amount,reason
                  </div>
                </div>

                {csvPreview.length > 0 && (
                  <div className="virement-form__csv-preview">
                    <h4>Aperçu des données</h4>
                    <table className="virement-table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Numéro de compte</th>
                          <th>Montant</th>
                          <th>Motif</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvPreview.map((row, index) => (
                          <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.accountNumber}</td>
                            <td>{formatCurrency(Number.parseFloat(row.amount) || 0)}</td>
                            <td>{row.reason || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            <div className="virement-form__summary">
              <div className="virement-form__summary-item">
                <span>Nombre de virements:</span>
                <span>{mode === "manuel" ? virements.length : csvPreview.length}</span>
              </div>
              <div className="virement-form__summary-item">
                <span>Montant total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="virement-form__summary-item">
                <span>Compte source:</span>
                <span>
                  {selectedCompte?.type} - {selectedCompte?.numéroCompte}
                </span>
              </div>
              <div className="virement-form__summary-item">
                <span>Solde disponible:</span>
                <span>{formatCurrency(selectedCompte?.solde || 0)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="virement-form__button"
              disabled={isSubmitting || (mode === "manuel" ? virements.length === 0 : csvPreview.length === 0)}
            >
              {isSubmitting ? "Traitement en cours..." : "Effectuer les virements"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default VirementsGroupes

